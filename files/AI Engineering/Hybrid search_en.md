# Hybrid search: are two signals better than one?

Let’s start with a point I feel strongly about: semantic search has not made keyword search obsolete. I want to emphasize this because I have seen too many people believe the opposite, especially those new to the topic of retrieval in recent years. Dismissing keyword search as "old stuff" is an oversimplification, and that simplification will eventually come at a cost.

The real point is this: every retrieval strategy makes specific, predictable, and often complementary errors. Hybrid search exists because someone looked at these errors closely and realized that relying on a single signal is a vulnerability that a serious system cannot afford.

This article is not a competition to pick a winner between keyword and semantic search. The goal is to understand **what errors different retrieval signals make**, why they make them, and how to build a system that combines them without one canceling out the other. To make this more manageable, we will use a guiding case study: a retrieval system for a cooking app—a engine that must retrieve recipes, ingredients, regional variations, and nutritional information based on user queries. It is a familiar domain, but one with enough complexity to reveal the real limits of each approach.

## When a retrieval system depends on a single signal

Imagine you are building the search engine for a recipe app. You have a database with thousands of Italian recipes, each with a title, list of ingredients, instructions, regional variations, and notes. A user searches for "pasta e fagioli." With keyword search, for example using BM25 (we will see what that consists of later), the result is immediate and precise: all recipes that contain those exact terms, ordered by statistical relevance. It works well.

But another user searches for "a hearty first course for winter with legumes." Here, keyword search struggles: no recipe literally contains that phrase. "Pasta e fagioli" is exactly what they need, but the system doesn't know that because it doesn't understand that "hearty first course for winter with legumes" and "pasta e fagioli" are **potentially** talking about the same thing.

So, you introduce a semantic search based on embeddings. The system now understands that the query is semantically close to recipes with legumes and winter soups. Among the individual dishes it finds, "pasta e fagioli" appears in the results. Problem solved? Not entirely.

The next day, a user searches for "recipe with 'nduja," and the semantic search returns recipes with spicy salami, Calabrian chili, or spicy sauces. These dishes are semantically close to the concept of 'nduja, but the user specifically wanted 'nduja as an ingredient, not the generic concept of "spicy Calabrian." Or, they search for "flourless caprese cake," and the system also returns the classic caprese cake because embeddings capture the semantic proximity between the two recipes but do not grasp the negation with the same precision. Or, they search for a specific intolerance code like "E471," and the semantic search doesn't know what to do with that token.

These are not bugs. They are the structural <span class="inline-note"><strong>failure modes</strong><button type="button" class="inline-note__trigger" aria-label="Explain failure modes"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>Failure modes</strong> refers to the typical and predictable ways in which a system fails. In practice: not random errors, but recurring patterns of error that emerge because every approach has structural limitations.</span></span> of each individual approach. And hybrid search is born precisely from this: the realization that keyword and semantic search fail in different, often complementary ways, and that a robust system must be able to triangulate.

## How keyword search works and why it is still incredibly strong

Classic keyword search is based on BM25, an algorithm derived from TF-IDF but with two important refinements: term frequency saturation, so that repeating a word twenty times does not multiply the score by twenty, and document length normalization, so that a long document is not penalized simply because it contains more terms.

[BM25 works on an **inverted index**: a data structure that maps every term to the list of documents containing it, along with frequencies and positions.](https://medium.com/@noumannawaz/lesson-8-hybrid-retrieval-bm25-dense-bac3c702318b) It is a technology with decades of optimization behind it and is extremely efficient. It does not require GPUs, scales well, and returns results in a few milliseconds even on corpora of millions of documents.

In our culinary app, BM25 is unbeatable when the query contains exact terms that appear in the recipes. "Carbonara," "porcini mushroom risotto," "eggless tiramisu": these are all queries where a direct lexical match is exactly what is needed. If a user searches for a specific, perhaps uncommon ingredient like "anchovy extract" or "bottarga," BM25 precisely finds the documents containing those terms. It is fast, predictable, and the results are explainable: you can always explain why a document was retrieved.

However, the failure modes of keyword search are well-documented. **Vocabulary mismatch** is the most significant: if the user uses words different from those in the document, the system finds nothing. "Escarole" and "curly endive" are the same vegetable, but to BM25, they are two completely different strings. **Synonym blindness** is a specific case of this: "car" and "automobile" are strangers to an inverted index. More generally, BM25 lacks any semantic understanding: "a quick dinner dish" will not match any recipe because no recipe describes itself with those exact words.

There is also a subtle problem of **exact match bias**: BM25 may return documents that contain the query terms in irrelevant contexts. If the phrase "this is not a carbonara" appears in the instructions for a cake, that recipe might appear in the results for "carbonara." The term is there, but the context is not.

## Why semantic search was created and where it truly helps

Semantic search was created to overcome vocabulary mismatch. The idea is to represent both queries and documents as vectors in a high-dimensional **vector space**—typically 768 or 1536 dimensions—where geometric proximity corresponds to similarity in meaning.

An embedding model, typically a transformer like BERT or its derivatives, reads text and compresses it into a dense vector of decimal numbers. This process occurs for both documents at indexing time and for the query at search time. [Retrieval consists of finding the document vectors closest to the query vector using metrics such as cosine similarity or dot product.](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag)

To perform this on millions of documents within a reasonable timeframe, **approximate nearest neighbors** (ANN) algorithms are used, the most common of which is HNSW (Hierarchical Navigable Small World). HNSW builds a multi-layered navigable graph where each node is a vector and edges connect nearby vectors. The search starts at the top levels, where the graph is sparse, and descends toward denser levels, progressively approaching the nearest neighbors. It is "approximate" because it does not guarantee finding the perfect neighbor, but in practice, recall is very high and latency is in the 10–50 millisecond range.

In our culinary app, semantic search shines when the query is conceptual. "A light dish for summer" retrieves salads, carpaccios, and gazpacho, even if none of these recipes contain those words. "Something sweet with almonds" finds caprese cake, cantuccini, and almond paste. The system understands the intent, not just the terms.

[The failure modes of semantic search are equally real and often underestimated. The most insidious is **semantic drift**: the system retrieves documents that are in the same semantic neighborhood as the query but do not answer the question.](https://chamomile.ai/challenges-dense-retrieval/) Searching for "pesto pasta" might also return recipes for salsa verde, chimichurri, or other herb-based sauces because the embeddings capture the conceptual proximity between these preparations. These are plausible but incorrect results.

Then there is **entity confusion**: "recipes with apples" might return recipes that mention Apple in the context of tech-food, because the embedding vector merges different meanings into a single representation. And there is **blindness to specific tokens**: codes, acronyms, infrequent proper names, numbers, and allergen identifiers like "E471" are poorly represented in the vector space. A general-purpose model has not learned to assign weight to those tokens.

[A more subtle problem is **negation blindness**. "Caprese cake without chocolate" and "chocolate caprese cake" produce very similar embeddings because models capture thematic proximity but struggle to encode "without" as an inversion of meaning.](https://chamomile.ai/challenges-dense-retrieval/) In practice, this means that semantic search can return results that explicitly contradict the query.

## Hybrid search is not a compromise, it is an architecture

With this context in mind, hybrid search stops being a "checkbox" feature and becomes a design choice. It is not about simply mixing a bit of keyword search with a bit of semantics; it is about recognizing that these two signals have complementary error profiles and building a system that combines them in a controlled manner.

[In technical terms, a hybrid search pipeline executes at least two retrievers in parallel: one **sparse** (typically BM25 on an inverted index) and one **dense** (vector search on an HNSW index), then merges the results into a single list.](https://www.elastic.co/what-is/hybrid-search) The fusion step is critical, and there are two main families of approaches.

[**Score fusion** normalizes the scores from both retrievers onto a common scale and combines them using a weighted average.](https://medium.com/thinking-sand/hybrid-search-with-bm25-and-rank-fusion-for-accurate-results-456a70305dc5) The typical formula is: final_score = α × sparse_score + (1-α) × dense_score, where α is a weight calibrated to your specific dataset. The advantage is that it preserves magnitude information: a document that dominates a retriever with a very high score is treated differently than one that is just above the threshold. The problem is that normalization is difficult. BM25 scores are unbounded and depend on corpus statistics, while cosine similarity ranges from -1 to 1. Bringing them onto the same scale using min-max requires knowing the extreme values, which are not always available in a distributed system. Furthermore, the weight α must be calibrated on labeled data; you need at least 50–100 annotated queries to obtain a reasonable value.

[**Rank fusion**, and in particular Reciprocal Rank Fusion (RRF), ignores scores entirely and works only on the ranking positions.](https://medium.com/thinking-sand/hybrid-search-with-bm25-and-rank-fusion-for-accurate-results-456a70305dc5) The formula is elegant: for each document, the RRF score is the sum of 1/(k + rank) for every list in which the document appears, where k is a smoothing constant (typically 60). A document that appears in the first position in both lists gets a high score; one that appears in only one list gets a lower one. The constant k controls how quickly the importance of the position decays. The great advantage of RRF is that it requires no calibration: it works reasonably well as a zero-config default because it does not need to normalize incomparable scores. The limitation is that it discards information: a document that is first in the vector list by a huge margin is treated the same as one that is first by a hair.

In our culinary app, the pipeline works like this: the user searches for "pasta e ceci alla romana." BM25 retrieves recipes that contain those exact terms. Vector search retrieves semantically related recipes, such as "pasta e ceci with rosemary" or "Lazio-style chickpea soup," even if they do not contain "alla romana." The fusion step combines them: recipes appearing in both lists rise to the top, while those appearing in only one list remain but with a lower score. The result is more robust than either signal taken individually.

### Sparse retrieval is not just BM25

It is worth pausing on a distinction that is often overlooked: when we talk about sparse retrieval, we do not just mean classic BM25. [There is a family of models called **learned sparse representations**, the most well-known of which is SPLADE (Sparse Lexical and Expansion Model). SPLADE uses a transformer to produce a sparse representation of the text—a vector with many zero dimensions and a few non-zero values—but unlike BM25, these dimensions are learned by the neural network and include terms that do not appear in the original text.](https://www.pinecone.io/learn/splade/) If the document mentions "automobile," SPLADE might also activate the dimensions corresponding to "car," "vehicle," or "driving." This solves the vocabulary mismatch while keeping the sparse structure compatible with inverted indexes.

[In practice, SPLADE is sparse in form but semantic in content. It lives in the same infrastructure as BM25 (the inverted index), but with learned weights and vocabulary expansion.](https://blog.premai.io/hybrid-search-for-rag-bm25-splade-and-vector-search-combined/) It is not keyword search, and it is not dense retrieval: it is sparse retrieval with semantic capabilities. Some providers, such as Elasticsearch with ELSER, have developed their own proprietary sparse models following this intuition.

### Hybrid retrieval and reranking are different things

Another fundamental distinction to keep in mind: hybrid retrieval and reranking are not the same thing, even though they often appear in the same pipeline. Hybrid retrieval combines the results of multiple retrievers during the retrieval phase. Reranking happens afterward, taking the candidates already retrieved and reordering them using a more powerful model.

[The most effective rerankers are **cross-encoders**: models that take the concatenated query-document pair as input and produce a single relevance score. Unlike the bi-encoders used in dense retrieval, where the query and document are encoded separately, the cross-encoder can model fine-grained interactions between query terms and document terms across all transformer layers.](https://www.pinecone.io/learn/series/rag/rerankers/) This makes them much more accurate but also much slower: they must perform a full inference for every pair, making them viable only for the top 20–50 candidates, not for millions of documents.

This is where the challenge lies: **a reranker can only reorder what the retrieval has already found**. If the retrieval fails to find a relevant document, no amount of reranking can fix it. This is why recall is won during the retrieval phase and precision during the reranking phase. Consequently, a well-designed pipeline often includes both: hybrid retrieval to maximize recall, followed by reranking to refine precision.

[Among the most widely used rerankers today are BAAI's bge-reranker-v2-m3 (open source, 278 million parameters, excellent multilingual performance), Cohere Rerank 3.5 (managed API, reliable in production), and the Elastic Rerank and Jina AI models integrated into the Elasticsearch ecosystem.](https://markaicode.com/bge-reranker-cross-encoder-reranking-rag/) The computational cost is in the range of 80–350 milliseconds on a CPU for a batch of 20–50 candidates, dropping to 50–100 milliseconds on a GPU.

### Why this topic has returned to the spotlight

It is worth mentioning why hybrid search has exploded as a topic in recent years. The answer lies in RAG (Retrieval-Augmented Generation) systems: pipelines that retrieve documents from a knowledge base and pass them to a large language model to generate responses. In a RAG system, the quality of the retrieval determines the quality of the generation. If the retrieval misses relevant documents, the model generates hallucinated or incomplete answers. If it retrieves misleading documents, the model integrates them uncritically into the response.

This has made retrieval a critical component in a new way: it is no longer just about showing a list of results to a human user who can evaluate them, but about providing context to a system that will consume it automatically. The requirements have shifted: for classic search, precision is paramount because the user sees the results directly and incorrect ones are immediately obvious; for RAG, recall is even more important, because the model can filter out noise but cannot invent information it has not received. Hybrid search, by combining multiple signals to maximize recall without sacrificing too much precision, has become the de facto standard for production RAG systems.

## How providers interpret hybrid search

Every provider has made different design choices regarding how to implement hybrid search, and these choices reflect their history and architectural vision. Understanding these differences is more useful than any feature comparison table.

### Elasticsearch: the most complete, the most layered

Elasticsearch is arguably the most mature system for hybrid search today, the result of an evolution rooted in its DNA as a full-text search engine. Architecturally, it combines **BM25 on an inverted index with kNN search on dense vectors** and, optionally, **ELSER** (Elastic Learned Sparse Encoder), a proprietary sparse model that functions as a sort of internal SPLADE within the Elastic ecosystem.

[The heart of the system is the **retriever framework**, available since version 8.16: a composable tree structure where each node is a retriever, and composite retrievers can nest leaf retrievers to arbitrary depths. In a single API call, you can define: retrieve with BM25, retrieve with kNN, merge with RRF, then re-rank with a cross-encoder. Everything happens server-side, with no client-side logic required.](https://www.elastic.co/docs/solutions/search/retrievers-overview)

[There are two merging options: **RRF**, which is robust and requires no calibration, and a more recent **linear retriever** that combines normalized scores using weights per retriever.](https://www.elastic.co/what-is/hybrid-search) The linear retriever is more accurate when weights are correctly calibrated, but it requires labeled data for calibration.

Elasticsearch has invested heavily in reranking. It features an internal reranking model (Elastic Rerank, based on DeBERTa v3, with **184 million parameters** that internal benchmarks suggest compete with 2-billion-parameter models), integrations with Cohere and Jina AI, and support for custom models uploaded via Eland.

[Control is granular: weights for retrievers, fusion parameters, and filtering for both pre- and post-vector search (with a documented pitfall: filtering in a `bool`/`filter` context acts as a post-filter on kNN, not a pre-filter, which can unexpectedly return zero results).](https://softwaredoug.com/blog/2025/02/08/elasticsearch-hybrid-search) The downside is complexity: Elasticsearch exposes many knobs, and it is easy to use them incorrectly.

Pricing on Elastic Cloud is consumption-based, measured in VCU (Virtual Compute Units); ML nodes for ELSER require at least 4 GB of RAM, while reranking requires at least 8 GB. Self-hosting is possible under the AGPL license, with infrastructure costs depending on scale.

### OpenSearch: The open-source alternative with a different approach to fusion

[OpenSearch implements hybrid search through the **Neural Search plugin**, included by default since version 2.4, and a dedicated query type (`hybrid`) introduced in 2.11.](https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/index/) The architecture differs from Elasticsearch: fusion does not occur through a composable retriever, but through a **search pipeline** that intercepts results between the query and fetch phases.

[OpenSearch's strength lies in its variety of normalization and score-combination options. It offers three normalization techniques (min-max, L2, z-score) and three combination methods (arithmetic, geometric, and harmonic mean), plus RRF as of version 2.19.](https://docs.opensearch.org/latest/search-plugins/search-pipelines/normalization-processor/) In total, it offers **more possible combinations than Elasticsearch** for fine-tuning score-based fusion.

The trade-off is that configuration requires more boilerplate: you must create an ingestion pipeline for embedding generation, a search pipeline for fusion, and register the ML models. Weights are defined in the pipeline, not the query, meaning different weight configurations require different pipelines.

Regarding reranking, OpenSearch supports cross-encoders deployed via ML Commons and connectors to Amazon Bedrock and Cohere. [Version 3.0 introduced native support for common filters in hybrid queries, eliminating the need to manually duplicate filters in every sub-query.](https://opensearch.org/blog/introducing-common-filter-support-for-hybrid-search-queries/)

[Pricing for AWS OpenSearch Service starts at approximately **$350 per month** for the minimum serverless configuration (2 OCU in high availability).](https://cloudchipr.com/blog/aws-opensearch-pricing) Self-hosting is free under the Apache 2.0 license.

### Pinecone: Sparse and dense in the same vector space

Pinecone takes a radically different approach: it lacks a traditional BM25 engine. It treats everything as vectors. [Hybrid search is achieved in two ways: a **single hybrid index** where each record contains both a dense and a sparse vector (generated by a BM25 encoder or SPLADE), or **two separate indexes**—one dense and one sparse—whose results are combined client-side.](https://www.pinecone.io/guides/search/hybrid-search)

[In the single hybrid index, Pinecone treats the sparse-dense pair as a single vector and calculates the dot product across the entire dimensional space. There is no server-side alpha parameter: the balance between signals is achieved by scaling the vector values client-side before the query.](https://www.pinecone.io/guides/indexes/pods/query-sparse-dense-vectors) It works, but it is less elegant than server-side solutions.

[An important detail regarding serverless infrastructure: on serverless indexes, **Pinecone retrieves by dense vectors first and then re-ranks with sparse vectors**, which means the sparse signal has less influence than the nominal alpha parameter would suggest.](https://www.pinecone.io/guides/search/hybrid-search)

For the two-index approach, which Pinecone calls "cascading retrieval," combination occurs via a reranker rather than score fusion. [Pinecone has explicitly stated that reranking outperforms heuristics like RRF and offers integrated managed rerankers: `pinecone-rerank-v0`, Cohere Rerank 3.5, and `bge-reranker-v2-m3`, all hosted on Pinecone servers.](https://www.pinecone.io/blog/cascading-retrieval-with-multi-vector-representations/)

Pricing is consumption-based: Read Units are based on the namespace size per query ($16 per million RUs in the Standard plan), Write Units are for ingestion, and storage is approximately $0.33 per GB per month. Costs scale with query volume, which can become significant at high traffic levels.

### Qdrant: multi-vector with server-side composable pipelines

[Qdrant is built on a **multi-vector per point** architecture: each record can hold multiple vectors with different names, dimensions, and metrics. A single point can contain a dense vector for semantic search, a sparse vector for BM25, and even ColBERT vectors for late-interaction reranking.](https://qdrant.tech/documentation/concepts/hybrid-queries/)

[Hybrid search is implemented via the **prefetch** mechanism in the Query API: each prefetch is an independent sub-query that retrieves candidates from a specific vector, and the results are merged server-side using RRF or DBSF (Distribution-Based Score Fusion). Prefetches can be nested to build arbitrary multi-stage pipelines, all within a single API call.](https://qdrant.tech/course/essentials/day-3/hybrid-search/)

[A key strength: since version 1.7, **sparse search is exact**, not approximate, thanks to a dedicated inverted index. There is zero recall loss for lexical matching.](https://qdrant.tech/course/essentials/day-3/sparse-vectors/) As of 1.15.2, BM25 conversion happens natively server-side using the IDF modifier. [Since 1.16, prefetch weights are configurable in RRF, and the constant k is customizable.](https://qdrant.tech/blog/qdrant-1.16.x/)

[The lack of hosted cross-encoder rerankers is a limitation: reranking is performed via ColBERT vectors in the prefetch (a late-interaction model that is faster but less precise than a pure cross-encoder) or via external services.](https://qdrant.tech/documentation/advanced-tutorials/reranking-hybrid-search/) Written in Rust with SIMD acceleration, Qdrant is among the highest performers in pure latency benchmarks.

[Pricing for Qdrant Cloud is based on infrastructure (vCPU, RAM, disk) with no per-query costs: once the cluster is provisioned, queries are unlimited.](https://qdrant.tech/pricing/) Self-hosting is free under the Apache 2.0 license.

### Weaviate: the vector database born hybrid

[Weaviate started as a vector database and added BM25 as a complement. Hybrid search combines **BM25F** (a variant of BM25 with field-level boosting) and **dense vector search** in a single operation. The **alpha** parameter controls the balance: alpha=1 is pure vector search, alpha=0 is pure BM25, and alpha=0.5 is the balanced default.](https://weaviate.io/blog/hybrid-search-explained)

[The evolution of its fusion algorithms is instructive. Initially, Weaviate used simple summation. Since version 1.20, it has introduced two options: **rankedFusion** (rank-based, similar to RRF) and **relativeScoreFusion** (normalizes actual scores and combines them with a weighted average). Since 1.24, relativeScoreFusion has become the default because it preserves more information than rank-based fusion.](https://weaviate.io/developers/weaviate/concepts/search/hybrid-search)

[Weaviate does not natively support sparse vectors like SPLADE: the keyword component is exclusively classic BM25 on an inverted index.](https://weaviate.io/blog/hybrid-search-for-web-developers) This is a limitation if you want to use learned sparse retrieval, but for most use cases, native BM25 is sufficient.

Regarding reranking, Weaviate integrates modules for Cohere Rerank, Jina AI, Voyage AI, and self-hosted transformers. Native multi-tenancy (supporting over 50,000 tenants per node) is a strong differentiator for SaaS applications. [Pricing for Weaviate Cloud starts at **$45 per month** for the Flex plan, calculated based on stored vector dimensions.](https://particula.tech/blog/weaviate-pricing-free-tier-guide) Self-hosting is free under the BSD-3 license.

### Azure AI Search: the most complete out-of-the-box pipeline

Azure AI Search is the only provider on this list that began as a traditional enterprise search service and added vector capabilities later. This background is reflected in a multi-stage pipeline that is arguably the most complete available without writing custom orchestration code.

The standard pipeline consists of three stages. First: **BM25 and vector search** in parallel. [Second: fusion using **RRF** (the only available fusion method; score fusion is not supported). Third: **semantic ranker**, a reranker based on models derived from Microsoft Bing that re-ranks the top 50 results using multilingual deep learning.](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) The semantic ranker is more than just a reranker: it also extracts captions and can return direct answers extracted from documents. A fourth stage, **agentic retrieval**, is currently in preview; it decomposes complex queries into sub-queries, executes them in parallel, and merges the results.

[Control over the BM25/vector balance is indirect: there is no alpha parameter, but you can assign a **weight** to each vector query and control how many BM25 results feed into the fusion process using the maxTextRecallSize parameter.](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

Pricing is based on Search Units (replica × partition), starting at approximately **$75 per month** for the Basic tier. The semantic ranker incurs an additional cost per query after the free quota is exhausted. Standard queries (full-text and vector) are included in the unit cost. The tight integration with Azure OpenAI and the broader Azure ecosystem makes Azure AI Search a natural choice for organizations already within that ecosystem, though it does introduce significant vendor lock-in.

### Conceptual families

Beyond individual providers, it is useful to group approaches into three families.

The first is **keyword + dense vectors**: traditional BM25 on an inverted index combined with ANN search on embeddings. This is the approach taken by Weaviate, Azure AI Search, and the most common configuration for Elasticsearch and OpenSearch. The advantage is conceptual simplicity and proven infrastructure; the limitation is that the keyword component lacks semantic capabilities.

[The second is **dense + sparse retrieval**: dense vectors combined with learned sparse vectors (such as SPLADE or similar). This is the approach used by Pinecone (sparse-dense index), Qdrant (multi-vector with native sparse support), and Elasticsearch with ELSER.](https://www.emergentmind.com/topics/dense-sparse-hybrid-retrieval) The advantage is that learned sparse retrieval solves the vocabulary mismatch problem without sacrificing the efficiency of the inverted index; the limitation is the added complexity of generating and managing two types of embeddings.

The third is **multi-stage retrieval with fusion and reranking**: multi-stage pipelines where fusion is followed by reranking using a more powerful model. Azure AI Search with the semantic ranker, Elasticsearch with the full retriever framework, and Qdrant with nested prefetches fall into this category. In practice, this configuration yields the best results, but it is also the most complex to configure, evaluate, and maintain.

### Secondary providers in brief

[**Redis** (with Redis Stack) introduced the FT.HYBRID command in version 8.4, which merges BM25 and vector search into a single command with support for RRF and linear combination.](https://redis.io/blog/revamping-context-oriented-retrieval-with-hybrid-search-in-redis-84/) Its strength is sub-millisecond in-memory speed; the limitation is that everything must reside in RAM, and ranking options are less sophisticated.

[**Vespa** is arguably the most powerful and flexible system for hybrid search, used in production by Perplexity AI for its entire retrieval layer. Its **phased ranking** system (first-phase, second-phase, global-phase) with arbitrary ranking expressions in tensor algebra has no equivalent. It can execute ONNX models, ColBERT MaxSim, and cross-encoders, all within the serving layer.](https://blog.vespa.ai/improving-zero-shot-ranking-with-vespa-part-two/) It natively supports BM25, HNSW, SPLADE, and any custom model. However, operational complexity is high: it requires learning YQL, rank-profiles, cluster configuration, and specific concepts like weakAnd and match-features.

[**Milvus/Zilliz** has supported multi-vector fields (dense and sparse) in the same collection since version 2.4, with fusion via WeightedRanker or RRFRanker. It recently added a built-in BM25 function that generates sparse vectors from text without external preprocessing.](https://zilliz.com/learn/hybrid-search-combining-text-and-image) It is a pure vector database with a distributed architecture that separates compute and storage, performing well in ANN tasks but offering less sophisticated ranking options than Vespa or Elasticsearch.

**Typesense** offers hybrid search as an automatic combination of keyword and vector search whenever a query includes both text fields and auto-embedding fields. The fusion is rank-based, using an alpha parameter (defaulting to 0.3 for vector and 0.7 for keyword). Its strength lies in its extreme simplicity: a single binary with no dependencies, deployment in minutes, and automatic typo tolerance. Its limitation is less flexibility in the fusion process and the lack of native reranking.

## How to build a concrete hybrid pipeline

Let’s return to our cooking app and build a concrete hybrid pipeline, step by step.

The first step is **chunking**. Recipes are structured documents: title, ingredient list, instructions, notes, and variations. Intelligent chunking does not cut at a fixed size but respects the structure: the title and ingredients form one chunk, the instructions another, and the notes yet another. Each chunk carries metadata (recipe title, region, category, preparation time) that will be useful for filtering. The ideal size is between 300 and 500 words per chunk, with a 10–20% overlap to ensure context is not lost at the boundaries.

The second step is **dual indexing**. For each chunk, two representations are generated: the inverted index for BM25, which the database builds automatically from the text terms, and the dense vector, generated by passing the text through an embedding model. If the provider supports it, a third signal is added: a sparse vector (ELSER in Elasticsearch, or sparse via SPLADE or BM25 encoder in Pinecone/Qdrant). Metadata is indexed as filterable fields.

The third step is the **query pipeline**. When a user searches for "pasta e ceci alla romana," the pipeline executes a BM25 query on the text and a kNN search on the query vector in parallel. The results are merged, typically using RRF as the default starting point. Then, optionally, the top 20–50 candidates are passed to a cross-encoder reranker that reorders them with greater precision. Finally, the top 5–10 results are returned to the user or passed to the LLM in the case of a RAG system.

The fourth step, often overlooked, is **filtering**. In our app, the user might have set filters for "gluten-free," "preparation time under 30 minutes," or "Campanian cuisine." These filters must be applied before the vector search (pre-filtering), not after; otherwise, you risk retrieving candidates that will be discarded later, degrading the effective recall. Most modern providers support pre-filtering for both BM25 and kNN, but implementations vary and the pitfalls are real.

[In pseudo-code, a complete pipeline on Qdrant might look something like this: a single call to the Query API with two prefetches (one sparse with native BM25 and one dense), a filter on region and category, RRF fusion with weights of 2.0 for dense and 1.0 for sparse, and a limit of 10 results.](https://qdrant.tech/course/essentials/day-3/hybrid-search-demo/) [On Elasticsearch, the same logic is expressed with a retriever tree: a `text_similarity_reranker` that wraps an `rrf` which in turn wraps a standard retriever (BM25) and a `knn` retriever, with a common filter and reranking on the text field.](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever)

## Measuring retrieval quality, seriously

Saying "it works better" without metrics is just an opinion. And opinions don't scale. To evaluate a hybrid search pipeline, you need precise metrics, and you need to understand what they actually measure.

**Precision@k** measures how many of the top k results are relevant. If 7 out of 10 results are pertinent, the precision@10 is 0.7. It is a simple metric, but it does not account for position: a relevant result in the tenth position is worth the same as one in the first. For classic search, where the user sees the list, precision is very important because incorrect results are immediately visible and degrade trust.

**Recall@k** measures how many of the total relevant documents appear in the top k results. If there are 20 pertinent recipes in the database and we retrieve 15 in the top 50, the recall@50 is 0.75. For RAG systems, recall is often the most critical metric: the model can filter out noise, but it cannot invent information that was not provided to it.

**MRR** (Mean Reciprocal Rank) measures how quickly the first relevant result appears, averaged across all queries. If the first correct result is in the second position, the reciprocal rank is 0.5; if it is in the first position, it is 1.0. MRR is the right metric when the user acts on the first good result, such as in a chatbot or a question-answering system.

**NDCG** (Normalized Discounted Cumulative Gain) is the most sophisticated metric: it accounts for both graded relevance (a result can be "highly relevant," "partially relevant," or "not relevant") and position (relevant results at the top of the list are logarithmically more valuable than those at the bottom). NDCG@10 is the standard benchmark for retrieval systems, used in the MTEB leaderboard and the BEIR benchmark. A hybrid search system should always be evaluated using NDCG@10 in addition to recall@k.

There is a substantial difference between evaluation for classic search and for RAG. Classic metrics (MRR, NDCG, MAP) assume that user attention decays monotonically with position. However, LLMs do not read results sequentially: they exhibit a **"lost in the middle"** effect, where accuracy is high for the first and last documents in the context but degrades for those in the middle. This means that classic metrics do not fully capture the impact of retrieval on generation quality. For RAG, it is useful to supplement retrieval metrics with end-to-end metrics like faithfulness and answer relevancy, which can be measured using frameworks like RAGAS or DeepEval.

Building an evaluation dataset is an investment that pays off. Start with 50–100 queries representative of real users, annotate relevance judgments for the retrieved documents (binary or graded), and calculate metric values as a baseline. Every change to the pipeline—whether it is a change in the embedding model, an adjustment to fusion weights, or the addition of a reranker—is evaluated against this baseline. Without this process, you are navigating blindly.

## Costs, in order of importance

### Computational cost comes first

The most significant cost of hybrid search is not the provider's price: it is the computational cost of running two retrievers instead of one, maintaining two indices, and optionally adding a reranker.

**Indexing** is the heaviest task during setup. Building an inverted index for BM25 is relatively inexpensive, even on a CPU. Building an HNSW index for dense vectors is significantly more expensive: it requires generating embeddings (which necessitates a GPU or paid API) and building the HNSW graph, which is CPU-intensive. To give an order of magnitude, indexing 24 million PubMed abstracts using only BM25 on Elasticsearch takes about 156 minutes on 16 cores; adding embeddings can double or triple that time.

**Storage** is the ongoing cost. [An inverted index is compact, the result of decades of optimization. A vector index with 768-dimension float32 vectors occupies about **3 KB per document**, plus the overhead of the HNSW graph, which typically multiplies that by 1.5–2x.](https://qdrant.tech/articles/sparse-embeddings-ecommerce-part-1/) For 10 million documents, we are talking about roughly 30–60 GB just for the vectors. Maintaining both indices costs 2–3 times the storage of a single one. Quantization (scalar, binary, product) can significantly reduce this cost with limited loss in accuracy.

**Query latency** is the cost perceived by the user. A pure BM25 query takes 10–80 milliseconds. A pure kNN search takes 10–50 milliseconds. A hybrid query with fusion, executed in parallel, takes the maximum of the two plus a negligible fusion overhead for RRF: typically **50–150 milliseconds** total. Adding a cross-encoder reranker on the top 20–50 candidates adds 80–350 milliseconds on a CPU, or 50–100 milliseconds on a GPU. For most applications, these latencies are acceptable, but for very high-throughput applications, the cost of reranking can become the bottleneck.

### Commercial cost depends on the model

Provider pricing models are so different that a direct comparison is misleading without specifying the use case.

**Infrastructure-based** providers (Qdrant Cloud, Weaviate Cloud, self-hosted Elasticsearch, self-hosted OpenSearch) charge for allocated resources: CPU, RAM, and disk. Queries are unlimited once the cluster is provisioned. This model favors high-volume query workloads.

**Consumption-based** providers (Pinecone Serverless, Elastic Cloud Serverless, AWS OpenSearch Serverless) charge per operation or per unit of compute consumed. This model favors workloads with variable or low volumes but can become expensive as traffic increases.

**Additional costs** that are often overlooked include: embedding generation (API models like those from OpenAI cost about $0.02–$0.13 per million tokens), reranking (Cohere Rerank costs $1 per thousand searches), and the Azure AI Search semantic ranker, which has a per-query cost after the free tier.

As a rough point of reference: a minimum configuration on Qdrant Cloud starts with the free tier (1 GB RAM); [Weaviate Cloud starts at $45 per month](https://weaviate.io/pricing); Azure AI Search Basic starts at approximately $75 per month; [AWS OpenSearch Serverless starts at approximately $350 per month](https://cloudchipr.com/blog/aws-opensearch-pricing); and Pinecone Standard starts at $50 per month plus usage-based costs.

### The cost of error is what no one budgets for

The most subtle cost is that of retrieval error. In a RAG system, a retrieval process that misses relevant documents produces incomplete answers or hallucinations. A retrieval process that pulls in misleading documents produces plausible but incorrect answers, which are worse than no answer at all. In our culinary app, returning a recipe with undeclared allergens because the retrieval failed to apply a filter is a concrete risk.

Choosing a solution that is too simple—such as a single retriever without reranking or a single signal without fusion—may seem like a way to save on complexity, but the cost manifests in the quality of the results. [Companies that have added reranking to their RAG pipelines have reported a **25% reduction in token usage** and associated costs, because the context provided to the model is more precise and requires less supporting material.](https://medium.com/@akanshak/the-critical-role-of-rerankers-in-rag-98309f52abe5)

On the other hand, over-engineering is a real risk. Adding complexity without evaluation creates opaque systems where problems are difficult to diagnose. The rule of thumb is: start with BM25 + dense + RRF as a baseline, measure, and add complexity (reranking, calibrated weights, learned sparse) only when the metrics justify it.

## The design principle behind hybrid search

Hybrid search is not just a checkbox feature. It is a design principle: do not trust a single signal. Every retrieval method has predictable failure modes, and the intelligent combination of different signals produces a system that is more robust than any single component.

If there is one takeaway, it is this: keyword search is not dead, semantic search is not magic, and hybrid search is not just the sum of the two. It is an architecture that acknowledges the imperfection of every signal and transforms it into resilience. How you implement it—with which provider, which fusion, and which weights—depends on your domain, volume, budget, and tolerance for error. But the "why" is universal: systems that depend on a single retrieval signal are fragile, and sooner or later, you pay for that fragility.