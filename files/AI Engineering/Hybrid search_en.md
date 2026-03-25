# Hybrid search: are two signals better than one?

## Introduction

Let’s start with a point I feel strongly about: semantic search has not made keyword search obsolete. I want to emphasize this because I have seen too many people believe the opposite, especially those who have entered the retrieval field in recent years. Dismissing keyword search as "old stuff" is an oversimplification, and that simplification eventually comes at a cost.

The real point is this: every retrieval strategy makes specific, predictable, and often complementary errors. Hybrid search exists because someone looked at these errors closely and realized that relying on a single signal is a vulnerability that a serious system cannot afford.

This article is not a competition to crown a winner between keyword and semantic search. The goal is to understand **what errors different retrieval signals make**, why they make them, and how to build a system that combines them without one canceling out the other. To make this manageable, we will use a guiding case study: a retrieval system for a culinary app—an engine that must retrieve recipes, ingredients, regional variations, and nutritional information based on user queries. It is a familiar domain, but one with enough complexity to reveal the real limits of each approach.

## Extracting information with a single method

Whenever I think about this problem, I think of a workplace scenario: a senior employee with an old, proven method, and a junior employee with a completely different method that works when the other fails (and vice versa). Both methods succeed or fail depending on the application domain and the ultimate goal. Keyword and semantic search are exactly like that senior and junior pair; they can excel at tasks the other struggles with.

Imagine building a search engine for a recipe app. You have a database with thousands of Italian recipes, each with a title, list of ingredients, instructions, regional variations, and notes. A user searches for "pasta e fagioli." With a keyword search, for example using BM25 (we will look at what that consists of later), the result is immediate and precise: all recipes that contain those exact terms, ordered by statistical relevance. It works well.

But another user searches for "a hearty winter first course with legumes." Here, keyword search struggles: no recipe literally contains that phrase. "Pasta e fagioli" is exactly what they need, but the system doesn't know it because it doesn't understand that "hearty winter first course with legumes" and "pasta e fagioli" are **potentially** talking about the same thing.

So, you introduce a semantic search based on embeddings. The system now understands that the query is semantically close to recipes with legumes and winter soups. Among the individual dishes it finds, "pasta e fagioli" appears in the results. Problem solved? Not entirely.

The next day, a user searches for "recipe with 'nduja," and the semantic search returns recipes with spicy salami, Calabrian chili, or spicy sauces. These dishes are semantically close to the concept of 'nduja, but the user specifically wanted 'nduja as an ingredient, not the generic concept of "spicy Calabrian." Or, they search for "flourless caprese cake," and the system also returns the classic caprese cake because embeddings capture the semantic proximity between the two recipes but do not grasp the negation with the same precision. Or, they search for a specific intolerance code like "E471," and the semantic search doesn't know what to do with that token.

These are not bugs. They are the structural <span class="inline-note"><strong>failure modes</strong><button type="button" class="inline-note__trigger" aria-label="Explain failure modes"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>Failure modes</strong> refers to the typical and predictable ways a system fails. In practice: not random errors, but recurring patterns of failure that emerge because every approach has structural limits.</span></span> of each individual approach. And hybrid search is born precisely from this: the realization that keyword and semantic search fail in different, often complementary ways, and that a robust system must be able to triangulate.

### How keyword search works and why it is still very powerful

Classic keyword search is based on BM25, an algorithm descended from TF-IDF (which we discussed in a previous article) but with two important refinements: *term frequency saturation*, where repeating a word twenty times does not multiply the score by twenty, and *document length normalization*, where a long document is not penalized simply because it contains more terms.

<figure class="article-figure">
  <img src="../Assets/bm25.svg" alt="Simplified diagram of how BM25 works in keyword search">
  <figcaption><strong>Figure 01.</strong> Simplified diagram of BM25: relevance increases with query term matches, but is adjusted by accounting for both term frequency and document length.</figcaption>
</figure>

BM25 operates on an [**inverted index**](https://medium.com/@noumannawaz/lesson-8-hybrid-retrieval-bm25-dense-bac3c702318b): a data structure that maps every term to the list of documents containing it, along with their frequencies and positions. It is a technology with decades of optimization behind it and is extremely efficient. It requires no GPU, scales well, and returns results in a few milliseconds, even across a set of millions of documents. If you want a deeper mathematical dive, I’ve left it here for you 👇🏻.

<details class="post-warning">
<summary><strong>Mathematical deep dive into BM25</strong> (click to expand)</summary>

If you really want to see where the insights we’re discussing fit into the formula, BM25 for a document $D$ and a query $Q$ can be written as:

$$
\text{BM25}(D,Q) = \sum_{i=1}^{n} \text{IDF}(q_i) \cdot \frac{f(q_i,D)\cdot(k_1+1)}{f(q_i,D)+k_1\cdot\left(1-b+b\cdot\dfrac{|D|}{\text{avgdl}}\right)}
$$

What really matters, however, isn't memorizing it. It’s understanding what it’s actually doing:

- **Sum over query terms**: BM25 doesn't assign a score "in bulk." It evaluates each query term separately and then sums the contributions. If you search for "pasta carbonara," the document gets some points for "pasta" and some for "carbonara."
- **IDF$(q_i)$**: This is the part that asks, "How much does this term actually discriminate?" If a term appears everywhere, it carries little weight. If it appears in only a few documents, it carries much more weight. In a recipe corpus, "recipe" isn't very useful; "guanciale" or "'nduja" carry a lot of weight.
- **$f(q_i,D)$ and $k_1$**: This is where the number of times a term appears in the document comes into play. But BM25 avoids the "the more, the better" trap. It increases the score using a **saturation** logic: the first few occurrences count for a lot, but then the marginal gain decreases. $k_1$ controls this specific curve.
- **$b$, $|D|$, and avgdl**: This part is used to avoid automatically favoring long documents. A long text has more words, so it is more likely to contain certain terms. BM25 corrects this effect by comparing the document length $|D|$ with the average length of the corpus, `avgdl`.

If you also want to see the IDF in its explicit form, it is usually written like this:

$$
\text{IDF}(q_i) = \ln\left(\frac{N - n(q_i) + 0.5}{n(q_i) + 0.5} + 1\right)
$$

where $N$ is the total number of documents in the corpus and $n(q_i)$ is the number of documents containing the term $q_i$.

Translated in a much less elegant but more useful way: BM25 tries to balance three things that are constantly at odds in retrieval. It wants to weight truly informative terms, it wants to recognize that a term appearing multiple times matters (but not infinitely so), and it wants to prevent a document from winning just because it is longer than the others. This is why, even today, it remains a baseline that is very difficult to beat.
</details>

In our culinary app, BM25 is unbeatable when the query contains exact terms that appear in the recipes. "Carbonara," "porcini mushroom risotto," "eggless tiramisu": these are all queries where a direct lexical match is exactly what is needed. If the user searches for a specific ingredient, perhaps a less common one like "colatura di alici" or "bottarga di muggine," BM25 finds precisely the documents containing those terms. It is fast, predictable, and the results are explainable: you can always explain why a document was retrieved <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain why BM25 is explainable"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>Why is it explainable?</strong> Because retrieval depends on observable signals: which query terms appear in the document, how often they appear, how rare those terms are in the corpus, and how much document length weighs in. In other words, you can trace the factors that produced the score without having to interpret something complex, like a dense vector space. But it’s not time to talk about that yet 😜</span></span>.

However, the failure modes of keyword search are well known. **Vocabulary mismatch** is certainly the most significant: if the user uses different words than those in the document, the system finds nothing. "Scarola" (escarole) and "indivia riccia" (curly endive) are the same vegetable, but to BM25, they are two completely different strings. More generally, BM25 has no semantic understanding: "a quick dish for dinner" won't match any recipe because no recipe describes itself with those exact words.

There is also a subtle issue of **exact match bias**: BM25 may return documents that contain the query terms in irrelevant contexts. If a cake recipe contains the phrase "this is not a carbonara," that recipe might appear in the results for "carbonara." The term is there, but the context is not.

### Semantic search

Semantic search was created to overcome the vocabulary mismatch. The idea is to represent both queries and documents as vectors in a high-dimensional **vector space**—typically 768 or 1536 dimensions—where geometric proximity corresponds to similarity in meaning.

<figure class="article-figure">
  <img src="../Assets/semantic_search_architecture_dark.svg" alt="Simplified semantic search architecture with query and document embeddings, vector indexing, and similarity retrieval">
  <figcaption><strong>Figure 02.</strong> Simplified semantic search diagram: documents and queries are transformed into embeddings within the same vector space, indexed in an ANN engine, and compared via similarity to retrieve the closest candidates.</figcaption>
</figure>

An embedding model, typically a transformer like BERT or its derivatives, reads text and compresses it into a dense vector of decimal numbers. This process occurs for both documents (at indexing time) and the query (at search time). [Retrieval consists of finding the document vectors closest to the query vector using metrics such as cosine similarity or dot product.](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag)

To perform this on millions of documents within a reasonable timeframe, we use **approximate nearest neighbors** (ANN) algorithms, the most popular of which is HNSW (Hierarchical Navigable Small World). HNSW builds a multi-layered navigable graph where each node is a vector and edges connect nearby vectors. The search starts at the top layers, where the graph is sparse, and descends toward denser layers, progressively closing in on the nearest neighbors. It is "approximate" because it does not guarantee finding the perfect neighbor, but in practice, recall is very high and latency is in the 10–50 millisecond range.

> 🎮 **Interactive simulation.** Below, you can follow the HNSW navigation layer by layer: the query enters from the top, traverses the most promising nodes, and the terminal explains in real-time what is happening at each step. If you want to open it separately, you can also find the [dedicated page](../Assets/hnsw-3d.html).

In our culinary app, semantic search excels when the query is conceptual. "A light dish for summer" retrieves salads, carpaccios, and gazpacho, even if none of those recipes contain those specific words. "Something sweet with almonds" finds caprese cake, cantuccini, and almond paste. The system understands the intent, not just the terms.

The failure modes of semantic search are equally common and often underestimated. The most insidious is [**semantic drift**](https://chamomile.ai/challenges-dense-retrieval/): the system retrieves documents that are in the same "semantic neighborhood" as the query but do not answer the question. Searching for "pesto pasta" might also return recipes for salsa verde, chimichurri, or other herb-based sauces because the embeddings capture the conceptual proximity between these preparations. These results are plausible but incorrect.

Then there is **entity confusion**: "recipes with apples" might return recipes that mention Apple in the context of tech-food, because the embedding model merges different meanings into a single representation. And there is **blindness to specific tokens**: codes, acronyms, rare proper nouns, numbers, and allergen identifiers like "E471" are poorly represented in the vector space. A general-purpose model has not learned to assign weight to those tokens.

A slightly more subtle problem is [**negation blindness**](https://chamomile.ai/challenges-dense-retrieval/). "Caprese cake without chocolate" and "chocolate caprese cake" produce very similar embeddings because the models capture thematic proximity but struggle to encode "without" as a reversal of meaning. In practice, this means that semantic search can return results that explicitly contradict the query.

## Hybrid search is not a compromise, it is an architecture!

With this context in mind, hybrid search stops being a checkbox feature and becomes a design choice. It is not about taking a bit of keyword search and a bit of semantic search and mixing them together like a cauldron; it is about recognizing that the two signals have complementary error profiles and building a system that combines them in a controlled manner.

Technically speaking, a [hybrid search pipeline](https://www.elastic.co/what-is/hybrid-search) runs at least two retrievers in parallel—one **sparse** (typically BM25 on an inverted index) and one **dense** (vector search on an HNSW index)—and then merges the results into a single list. Merging is the critical step, and there are two main families of approaches.

[**Score fusion**](https://medium.com/thinking-sand/hybrid-search-with-bm25-and-rank-fusion-for-accurate-results-456a70305dc5) normalizes the scores from the two retrievers onto a common scale and combines them using a weighted average. The typical formula is:

$$ s_{f} = \alpha × s_{s} + (1-α) \times s_d, $$

where $s_{f}$<span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain s_f"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>$s_f$</strong> is the final fusion score: the value used to rank the document after combining the sparse and dense signals.</span></span> is the final score, $s_{s}$<span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain s_s"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>$s_s$</strong> is the sparse score, i.e., the contribution of the lexical retriever (like BM25) after any necessary normalization to a common scale.</span></span> is the sparse score, $s_{d}$<span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain s_d"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>$s_d$</strong> is the dense score, i.e., the contribution of the embedding-based vector retriever, also mapped to the same scale as the sparse component.</span></span> is the dense score, and $\alpha$<span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain alpha"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>$\alpha$</strong> is the combination weight. In hybrid systems, it is typically chosen between 0 and 1: higher values give more weight to dense retrieval, while lower values favor keyword retrieval. There is no universal formula to calculate it; in practice, it is treated as a hyperparameter, and you choose it by testing multiple values on a set of annotated queries to maximize metrics like NDCG, MRR, or Recall.</span></span> is a weight calibrated to your specific dataset. The advantage is that it preserves magnitude information: a document that dominates a retriever with a very high score is treated differently than one that is just above the threshold. The problem is that normalization is difficult. BM25 scores are unbounded and depend on corpus statistics, while cosine similarity ranges between -1 and 1. Bringing them to the same scale using min-max requires knowing the extreme values, which are not always available in a distributed system. Furthermore, the $\alpha$ weight must be calibrated on labeled data: you need at least 50–100 annotated queries to obtain a reasonable value.

**Rank fusion**, and in particular [Reciprocal Rank Fusion (RRF)](https://medium.com/thinking-sand/hybrid-search-with-bm25-and-rank-fusion-for-accurate-results-456a70305dc5), ignores scores entirely and works only with ranking positions.

The formula is elegant: for each document, the RRF score is the sum of $\frac{1}{k + rank}$ for every list in which the document appears, where $k$ is a smoothing constant (typically 60). A document that appears in the first position in both lists gets a high score; one that appears in only one list gets less. The constant $k$ controls how quickly the importance of the position decays. The great advantage of RRF is that it requires no calibration: it works reasonably well as a zero-config default because it does not need to normalize incomparable scores. The limitation is that it discards information: a document that is first in the vector list by a huge margin is treated the same as one that is first by a hair.

> 🎮 **Interactive simulation.** Below, you can see how RRF changes as you vary `k`: moving the slider changes the weight of the top positions, and you can observe how the fused ranking is reordered.

<iframe
  src="../Assets/simulations/rrf.html"
  title="Interactive Reciprocal Rank Fusion simulation with k parameter"
  loading="lazy"
  style="width: 100%; min-height: 920px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

_Figure 04: Interactive Reciprocal Rank Fusion simulation. With a low `k`, the top positions carry much more weight; with a high `k`, the fusion becomes flatter and rewards the first position less aggressively. The classic reference of `k=60`, taken from the original paper, serves specifically to dampen the excessive advantage of rank 1 and favor documents that consistently appear in the top positions of multiple lists._

In our culinary app, the pipeline works like this: the user searches for "pasta e ceci alla romana." BM25 retrieves recipes that contain those exact terms. Vector search retrieves semantically related recipes, such as "pasta e ceci con rosmarino" or "minestra di ceci laziale," even if they don't contain "alla romana." Fusion combines them: recipes appearing in both lists move to the top, while those appearing in only one remain but with a lower score. The result is more robust than either signal taken individually.

### Sparse retrieval is not just BM25

It is worth pausing on a distinction that is often overlooked: when we talk about sparse retrieval, we don't just mean classic BM25. There is a family of models called **learned sparse representations**, the most well-known of which is [**SPLADE**](https://www.pinecone.io/learn/splade/) (Sparse Lexical and Expansion Model).

SPLADE uses a transformer to produce a sparse representation of the text—a vector with many zero dimensions and a few non-zero values. Unlike BM25, however, these dimensions are learned by the neural network and include terms that do not appear in the original text. If the document mentions "automobile," SPLADE may also activate the dimensions corresponding to "car," "vehicle," or "driving." This solves the vocabulary mismatch while keeping the sparse structure compatible with inverted indexes.

In practice, [SPLADE is sparse in form but semantic in content](https://blog.premai.io/hybrid-search-for-rag-bm25-splade-and-vector-search-combined/). Be careful, though: it is neither keyword search nor dense retrieval; it is sparse retrieval with semantic capabilities. Some providers, such as Elasticsearch with ELSER, have developed their own proprietary sparse models following this intuition.

### Hybrid retrieval and reranking are two different things

Another fundamental distinction to keep in mind is that hybrid retrieval and reranking are not the same thing, even though they often appear in the same pipeline. Hybrid retrieval combines the results of multiple retrievers during the retrieval phase. Reranking happens afterward, taking the already retrieved candidates and reordering them with a more powerful model.

The most effective [rerankers](https://www.pinecone.io/learn/series/rag/rerankers/) are **cross-encoders**: models that receive the concatenated query-document pair as input and produce a single relevance score. Unlike the bi-encoders used in dense retrieval, where the query and document are encoded separately, the *cross-encoder can model fine-grained interactions between the query terms and the document terms across all layers of the transformer*. This makes it much **more precise** but also **much slower**: it must perform a full inference for every pair, which makes it feasible only for the top 20–50 candidates, not for millions of documents.

> 🎮 **Dedicated simulation.** If you want to see visually how the order of results changes after reranking, you can open the [interactive reranker page](Assets/simulations/reranker-blog.html).

And this is where the rubber meets the road: **a reranker can only reorder what the retrieval has already found**. If the retrieval did not recover a relevant document, no reranking can fix it. This is why *recall* is used in the *retrieval* phase and *precision* in the *reranking* phase. And this is why a well-designed pipeline often has both: hybrid retrieval to maximize recall, then reranking to refine precision.

Among the most widely used rerankers today are BAAI's [bge-reranker-v2-m3](https://markaicode.com/bge-reranker-cross-encoder-reranking-rag/) (open source, 278 million parameters, excellent multilingual performance, though less so for Italian), [Cohere Rerank 4.0](https://docs.cohere.com/docs/rerank) (managed API, reliable in production), and the [Elastic Rerank](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-rerank) and [Jina AI](https://jina.ai/reranker/) models integrated into the Elasticsearch ecosystem. The computational cost is in the range of 80–350 milliseconds on a CPU for a batch of 20–50 candidates, which drops to 50–100 milliseconds on a GPU.

### From hybrid search to RAG

It is worth saying a few words about why hybrid search has exploded as a topic in recent years. The answer lies in RAG (Retrieval-Augmented Generation) systems: pipelines that retrieve documents from a knowledge base and pass them to a large language model to generate answers. In a RAG system, the **quality of the retrieval determines the quality of the generation**. If the retrieval misses relevant documents, the model generates hallucinated or incomplete answers. If it retrieves misleading documents, the model integrates them uncritically into the response.

This has made retrieval a critical component in a new way: it is no longer just a matter of showing a list of results to a human user who can evaluate them, but of providing context to a system that will consume it automatically. Requirements have shifted: for classic search, precision is paramount because the user sees the results directly and errors are immediately obvious. For RAG, recall is even more important because the *model can filter out noise* but **cannot invent information it has not received**. Hybrid search, by combining multiple signals to maximize recall without sacrificing too much precision, has become the de facto standard for production RAG systems.

## Hybrid search across providers?

Each provider has made different design choices on how to implement hybrid search, and these choices reflect their history and architectural vision. Understanding these differences is more useful than any feature comparison table.

### Elasticsearch: the most complete, the most layered

Elasticsearch is arguably the most mature system for hybrid search today, the result of an evolution rooted in its DNA as a full-text search engine. Architecturally, it combines **BM25 on an inverted index with kNN search on dense vectors** and, optionally, **ELSER** (Elastic Learned Sparse Encoder), a proprietary sparse model that functions as a sort of internal SPLADE within the Elastic ecosystem.

The heart of the system is the [**retriever framework**](https://www.elastic.co/docs/solutions/search/retrievers-overview), available since version 8.16: a composable tree structure where each node is a retriever, and composite retrievers can nest leaf retrievers to arbitrary depths. In a single API call, you can: retrieve with BM25, retrieve with kNN, fuse with RRF, and then re-rank with a cross-encoder. All server-side, with no client-side logic required.

There are two [fusion](https://www.elastic.co/what-is/hybrid-search) options: **RRF**, which is robust and requires no "calibration," and a more recent **linear retriever** that combines normalized scores with per-retriever weights. The linear retriever is more precise when weights are correctly calibrated, but it requires labeled data.

On the reranking front, Elasticsearch has invested heavily. It features an [internal reranking model](https://www.elastic.co/search-labs/blog/elastic-semantic-reranker-part-2) (Elastic Rerank, based on DeBERTa v3—**184 million parameters** that internal benchmarks suggest compete with 2-billion-parameter models), integrations with Cohere and Jina AI, and support for custom models loaded via Eland.

Control is granular: weights per retriever, fusion parameters, and filtering for both pre- and post-vector search (with a documented pitfall: filtering in a `bool`/`filter` context acts as a [post-filter on kNN, not a pre-filter](https://softwaredoug.com/blog/2025/02/08/elasticsearch-hybrid-search), which can unexpectedly return zero results). The downside is complexity: Elasticsearch exposes many knobs, and it is easy to use them incorrectly.

Pricing on Elastic Cloud is consumption-based, measured in VCU (Virtual Compute Units); ML nodes for ELSER require at least 4 GB of RAM, and at least 8 GB for reranking. Self-hosting is possible under the AGPL license, with infrastructure costs depending on scale.

### OpenSearch: the open-source alternative with a different approach to fusion

[OpenSearch](https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/index/) implements hybrid search through the **Neural Search plugin**, included by default since version 2.4, and a dedicated `hybrid` query type introduced in 2.11. The architecture differs from Elasticsearch: fusion does not occur through a composable retriever but through a **search pipeline** that intercepts results between the query phase and the fetch phase <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain query phase and fetch phase"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is the difference?</strong> The <strong>query phase</strong> is when OpenSearch executes the retrievers and produces an initial list of results with their respective scores. The <strong>fetch phase</strong> follows immediately: the engine retrieves the full content of the selected documents and prepares the final response. Saying the pipeline sits "between query and fetch" means it can normalize, fuse, or reorder results before they are materialized in the response.</span></span>.

OpenSearch’s strength lies in its variety of [normalization and score combination options](https://docs.opensearch.org/latest/search-plugins/search-pipelines/normalization-processor/). It offers three simple normalization techniques (min-max, L2, z-score) and three equally simple combination methods (arithmetic, geometric, and harmonic mean), plus RRF as of version 2.19. In total, it offers **more possible combinations than Elasticsearch** for fine-tuning score-based fusion.

The trade-off is that the configuration requires more boilerplate: you must create an ingestion pipeline for embedding generation, a search pipeline for fusion, and register the ML models. Weights are defined in the pipeline, not in the query, which means different weight configurations require different pipelines.

Regarding reranking, OpenSearch supports cross-encoders deployed via [ML Commons](https://sematext.com/opensearch-ml-commons-rag/) and connectors to [Amazon Bedrock](https://docs.opensearch.org/latest/tutorials/vector-search/semantic-search/semantic-search-bedrock-titan/) and Cohere. Version 3.0 introduced native support for [common filters](https://opensearch.org/blog/introducing-common-filter-support-for-hybrid-search-queries/) in hybrid queries, eliminating the need to manually duplicate filters across every sub-query.

[Pricing](https://cloudchipr.com/blog/aws-opensearch-pricing) for AWS OpenSearch Service starts at approximately **$350 per month** ($11.52 per day) for the S3-based configuration. Self-hosting is free under the Apache 2.0 license.

### Pinecone: sparse and dense in the same vector space

Pinecone takes a radically different approach: it does not have a traditional BM25 engine. It treats everything as vectors. [Hybrid search](https://docs.pinecone.io/guides/search/hybrid-search) is achieved in two ways: a **single hybrid index** where each record contains both a dense and a sparse vector (generated by a BM25 encoder or SPLADE), or **two separate indexes**—one dense and one sparse—whose results are combined client-side.

In the single hybrid index, Pinecone treats the [sparse-dense pair](https://docs.pinecone.io/guides/indexes/pods/query-sparse-dense-vectors) as a single vector and calculates the dot product across the entire dimensional space. There is no server-side alpha parameter; the balance between signals is achieved by scaling the vector values client-side before the query. It works, but it is less elegant than server-side solutions.

An important detail regarding serverless infrastructure: on serverless indexes, **Pinecone retrieves by dense vectors first and then re-ranks using sparse vectors**, which means the [sparse signal has less influence than the nominal alpha parameter suggests](https://docs.pinecone.io/guides/search/hybrid-search).

For the two-separate-index approach, which Pinecone calls "cascading retrieval," combination occurs via a reranker rather than score fusion. Reranking outperforms—[or at least that is what they claim](https://www.pinecone.io/blog/cascading-retrieval-with-multi-vector-representations/)—heuristics like RRF, and it offers integrated managed rerankers: `pinecone-rerank-v0`, `Cohere Rerank 3.5`, and `bge-reranker-v2-m3`, all hosted on Pinecone servers.

[Pricing](https://docs.pinecone.io/guides/get-started/test-at-scale) is consumption-based: Read Units based on the namespace size per query ($16 per million RUs in the Standard plan), Write Units for ingestion, and storage at approximately $0.33 per GB per month. Costs scale with query volume, which can become significant at high traffic levels.

### Qdrant: multi-vector with server-side composable pipelines

Qdrant starts with a [**multi-vector-per-point** architecture](https://qdrant.tech/documentation/concepts/hybrid-queries/): each record can have multiple vectors with different names, dimensions, and metrics. A single point can contain a dense vector for semantic search, a sparse one for BM25, and even ColBERT vectors for late-interaction reranking.

Hybrid search is implemented via the [**prefetch** mechanism in the Query API](https://qdrant.tech/course/essentials/day-3/hybrid-search/): each prefetch is an independent sub-query that retrieves candidates from a specific vector, and the results are merged server-side using RRF or DBSF (Distribution-Based Score Fusion) <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain DBSF"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is DBSF?</strong> It is a <strong>score fusion</strong> method: instead of looking only at the ranking position, as RRF does, it first attempts to make retriever scores comparable using their statistical distribution and then combines them. In practice, it retains more information from the original scores, but it requires those scores to be stable and meaningful enough to be normalized.</span></span>. Prefetches can be nested to build arbitrary multi-stage pipelines, all within a single API call.

One point that I believe deserves our attention is that, since version 1.7, [**sparse search is exact**, not approximate](https://qdrant.tech/course/essentials/day-3/sparse-vectors/), thanks to a dedicated inverted index. There is zero recall loss for lexical matching. Since version 1.15.2, BM25 conversion happens natively server-side using the IDF modifier. Since 1.16, [prefetch weights are configurable in RRF, and the k constant is customizable](https://qdrant.tech/blog/qdrant-1.16.x/).

The lack of hosted cross-encoder rerankers is a limitation: [**reranking** occurs via ColBERT vectors in the prefetch](https://qdrant.tech/documentation/advanced-tutorials/reranking-hybrid-search/) (a late interaction model that is less precise than a pure cross-encoder but much faster) or via external services. Written in Rust with SIMD acceleration <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain SIMD acceleration"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What does SIMD mean?</strong> It stands for <strong>Single Instruction, Multiple Data</strong>: the processor applies the same operation to multiple values in parallel, for example, comparing multiple vector numbers in a single pass. In engines like Qdrant, this significantly speeds up repetitive numerical calculations like distances and similarities.</span></span>, Qdrant is among the highest-performing in pure latency benchmarks.

[Pricing](https://qdrant.tech/pricing/) on Qdrant Cloud is based on infrastructure (vCPU, RAM, disk), with no per-query costs: once the cluster is provisioned, queries are unlimited. Self-hosting is free under the Apache 2.0 license.

### Weaviate: The vector database born hybrid

Weaviate started as a vector database and [added BM25 as a complement](https://weaviate.io/blog/hybrid-search-explained). Hybrid search combines **BM25F** (a variant of BM25 with field-level boosting) and **dense vector search** in a single operation. The **alpha** parameter controls the balance: alpha=1 is pure vector search, alpha=0 is pure BM25, and alpha=0.5 is the balanced default.

Initially, Weaviate used a simple sum. Since version 1.20, it has introduced two options: **rankedFusion** (based on ranks, similar to RRF) and **relativeScoreFusion** (which normalizes the actual scores and combines them using a weighted average). Since 1.24, relativeScoreFusion has become the default because it preserves more information than rank-based fusion <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain what preserving more information means"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What does this mean?</strong> A rank-based fusion only sees the position of the documents: first, second, third. Thus, it treats a first-place finish achieved by a huge margin the same as a first-place finish achieved by a hair's breadth. A score fusion, however, also retains <strong>how far ahead or behind</strong> a result was in the original scores. In this sense, it loses less signal than a method that reduces everything to just the ranking order.</span></span>.

[Weaviate does not natively support sparse vectors like SPLADE: the keyword component is exclusively classic BM25 on an inverted index.](https://weaviate.io/blog/hybrid-search-for-web-developers) This is a limitation if you want to use learned sparse retrieval, but for some use cases, native BM25 is sufficient.

For reranking, Weaviate integrates modules for Cohere Rerank, Jina AI, Voyage AI, and self-hosted transformers. Its native multi-tenancy (supporting over 50,000 tenants per node) is a strong differentiator for SaaS applications. [Pricing for Weaviate Cloud starts at **$45 per month** for the Flex plan, based on stored vector dimensions.](https://particula.tech/blog/weaviate-pricing-free-tier-guide) Self-hosting is free under the BSD-3 license.

### Azure AI Search: the most complete out-of-the-box pipeline

Azure AI Search is the only provider on this list that originated as a traditional enterprise search service and added vector capabilities later. This background is reflected in a multi-stage pipeline that is arguably the most complete available without writing custom orchestration code.

The [standard pipeline consists of three stages](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking):

1. **BM25 and vector search** in parallel.
2. Fusion using **RRF** (the only fusion method available; score fusion is not supported).
3. **Semantic ranker**, a reranker based on models derived from Microsoft Bing that re-ranks the top 50 results using multilingual deep learning. The semantic ranker is more than just a reranker; it also extracts captions and can return direct answers extracted from documents.
4. Currently in preview is a fourth stage, **agentic retrieval**, which decomposes complex queries into sub-queries, executes them in parallel, and merges the results.

Control over the BM25/vector balance is indirect: there is no alpha parameter, but you can assign a **weight** to each vector query and control how many BM25 results feed into the fusion process using the `maxTextRecallSize` parameter.

Pricing is based on Search Units (replica × partition), starting at approximately **$75 per month** for the Basic tier. The semantic ranker incurs an additional cost per query after the free quota is exhausted. Standard queries (full-text and vector) are included in the unit cost. Tight integration with Azure OpenAI and the broader Azure ecosystem makes Azure AI Search the natural choice for organizations already within that ecosystem, though it does introduce significant vendor lock-in.

### The macro-families

Beyond individual providers, it is useful to group these approaches into three families.

The first is **keyword + dense vectors**: traditional BM25 on an inverted index combined with ANN search on embeddings. This is the approach used by Weaviate, Azure AI Search, and the most common configuration for Elasticsearch and OpenSearch. The advantage is conceptual simplicity and proven infrastructure; the limitation is that the keyword component lacks semantic capabilities.

The second is [**dense + sparse retrieval**](https://www.emergentmind.com/topics/dense-sparse-hybrid-retrieval): dense vectors combined with learned sparse vectors (such as SPLADE or similar). This is the approach taken by Pinecone (sparse-dense index), Qdrant (multi-vector with native sparse support), and Elasticsearch with ELSER. The advantage is that learned sparse retrieval solves the vocabulary mismatch problem without sacrificing the efficiency of the inverted index; the limitation is the added complexity of generating and managing two types of embeddings.

The third is **multi-stage retrieval with fusion and reranking**: multi-stage pipelines where fusion is followed by reranking using a more powerful model. Azure AI Search with its semantic ranker, Elasticsearch with its full retriever framework, and Qdrant with nested prefetching fall into this category. In practice, this configuration yields the best results, but it is also the most complex to configure, evaluate, and maintain.

### Secondary providers in brief

[**Redis** (with Redis Stack)](https://redis.io/blog/revamping-context-oriented-retrieval-with-hybrid-search-in-redis-84/) introduced the `FT.HYBRID` command in version 8.4, which merges BM25 and vector search into a single command with support for RRF and linear combination. Its strength lies in sub-millisecond in-memory speed; the limitation is that everything must fit in RAM, and the ranking options are less sophisticated.

[**Vespa**](https://blog.vespa.ai/improving-zero-shot-ranking-with-vespa-part-two/) is arguably the most powerful and flexible system for hybrid search, used in production by Perplexity AI for its entire retrieval layer. Its **phased ranking** system (first-phase, second-phase, global-phase) with arbitrary ranking expressions in tensor algebra is unparalleled. It can execute ONNX models, ColBERT MaxSim, and cross-encoders, all within the serving layer. It natively supports BM25, HNSW, SPLADE, and any custom model. However, the operational complexity is high: it requires learning YQL <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain YQL"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is YQL?</strong> It is the <strong>Yahoo Query Language</strong> used by Vespa to express queries, filters, matching operators, and retrieval logic. Essentially, it is the language you use to tell the engine what to search for and how to do it.</span></span>, rank-profiles <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain rank-profile"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is a rank-profile?</strong> In Vespa, this is the configuration that defines <strong>how</strong> documents are evaluated and ordered: which features to use, which formulas to apply, and in which ranking phases to execute them.</span></span>, cluster configuration <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain cluster configuration"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What does this mean here?</strong> It refers to deciding how to distribute the system across multiple nodes: separating serving and content nodes, replication, sharding, hardware resources, and deployment topology. This is the infrastructure layer that impacts latency, capacity, and reliability.</span></span>, and specific concepts like weakAnd <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain weakAnd"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is weakAnd?</strong> It is a Vespa matching operator designed for efficient retrieval on multi-term queries: it does not require all terms to match strictly, but instead quickly selects the most promising documents based on the most informative terms.</span></span> and match-features <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain match-features"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What are match-features?</strong> These are signals calculated by Vespa during matching and ranking for each document, such as BM25, proximity, tensor scores, or model outputs. They are used both to order results and to inspect and debug the ranking.</span></span>.

[**Milvus/Zilliz**](https://zilliz.com/learn/hybrid-search-combining-text-and-image) supports multi-vector fields (dense and sparse) within the same collection, with fusion via WeightedRanker or RRFRanker. It has recently added a built-in BM25 function that generates sparse vectors from text without external preprocessing. It is a pure vector database with a distributed architecture that separates compute and storage; it is highly performant in ANN, though it offers less sophisticated ranking options than Vespa or Elasticsearch.

**Typesense** offers hybrid search as an automatic combination of keyword and vector search when the query includes both text fields and auto-embedding fields. Fusion is rank-based with an alpha parameter (defaulting to 0.3 for vector and 0.7 for keyword). Its strength lies in extreme simplicity: a single binary with no dependencies, deployment in minutes, and automatic typo tolerance. Its limitation is less flexibility in fusion and the absence of native reranking.

## How to build a concrete hybrid pipeline

Let's return to our culinary app and build a concrete hybrid pipeline, step by step.

The first step is **chunking**. Recipes are structured documents: title, ingredient list, instructions, notes, and variations. Intelligent chunking does not rely on fixed sizes but respects the document structure: the title and ingredients form one chunk, the instructions another, and the notes a third. Each chunk carries metadata (recipe title, region, category, preparation time) that will be useful for filtering. The ideal size is between 300 and 500 words per chunk, with a 10–20% overlap to ensure context is not lost at the boundaries.

The second step is **dual indexing**. For each chunk, two representations are generated: an inverted index for BM25, which the database builds automatically from the text terms, and a dense vector, generated by passing the text through an embedding model. If the provider supports it, a third signal is added: a sparse vector (ELSER in Elasticsearch, or sparse via SPLADE or BM25 encoder in Pinecone/Qdrant). Metadata is indexed as filterable fields.

The third step is the **query pipeline**. When a user searches for "Roman-style pasta and chickpeas," the pipeline executes a BM25 text query and a kNN vector search in parallel. The results are fused, typically using RRF as the initial default. Then, optionally, the top 20–50 candidates are passed to a cross-encoder reranker, which reorders them with greater precision. Finally, the top 5–10 results are returned to the user or passed to the LLM in the case of a RAG system.

The fourth step, often overlooked, is **filtering**. In our app, a user might have set filters for "gluten-free," "preparation time under 30 minutes," or "Campanian cuisine." These filters must be applied before the vector search (pre-filtering), not after; otherwise, you risk retrieving candidates that will later be discarded, degrading the effective recall. Most modern providers support pre-filtering for both BM25 and kNN, but implementations vary, and managing everything is not always straightforward.

In pseudo-code, a complete pipeline on Qdrant might look something like this: a single call to the Query API with two prefetches (one sparse with native BM25 and one dense), a filter on region and category, RRF fusion with weights of 2.0 for the dense and 1.0 for the sparse, and a limit of 10 results.

On Elasticsearch, the same logic is expressed with a retriever tree: a `text_similarity_reranker` wrapping an RRF, which in turn wraps a standard retriever (BM25) and a `knn` retriever, with a common filter and reranking on the text field.

## Measuring retrieval quality

Saying "it works better" without metrics is just an opinion. And as we know, opinions do not scale. To evaluate a hybrid search pipeline, you need precise metrics and an understanding of what they measure.

**Precision@k** measures how many of the top $k$ results are relevant. If 7 out of 10 results are pertinent, the precision@10 is 0.7. It is a simple metric, but it does not account for position: a relevant result in the tenth position is worth the same as one in the first. For classic search, where the user sees the list, precision is very important because incorrect results are immediately visible and degrade trust.

**Recall@k** measures how many of the total relevant documents appear in the top $k$ results. If there are 20 relevant recipes in the database and we retrieve 15 in the top 50, the recall@50 is 0.75. For RAG systems, recall is often the most critical metric: the model can filter out noise, but it cannot invent information that was not provided to it.

**MRR** (Mean Reciprocal Rank) measures how quickly the first relevant result appears, averaged across all queries. If the first correct result is in the second position, the reciprocal rank is 0.5; if it is in the first position, it is 1.0. MRR is the right metric when the user acts on the first good result, such as in a chatbot or a question-answering system.

**NDCG** (Normalized Discounted Cumulative Gain) is the most sophisticated metric: it accounts for both graded relevance <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain graded relevance"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What does this mean?</strong> It means relevance is not treated as a simple yes/no, but as a <strong>level</strong>: for example, a result might be worth 3 if it is highly relevant, 1 if it is only partially useful, and 0 if it is irrelevant. This allows the metric to reward truly excellent results more than those that are only vaguely pertinent.</span></span> (a result can be "highly relevant," "partially relevant," or "not relevant") and position (relevant results at the top of the list are worth logarithmically more than those at the bottom). NDCG@10 is the standard benchmark for retrieval systems, used in the MTEB leaderboard and the BEIR benchmark. A hybrid search system should always be evaluated using NDCG@10 in addition to recall@k.

The difference between evaluation for classic search and RAG is significant. Classic metrics (MRR, NDCG, MAP) assume that user attention decays monotonically with position. However, LLMs do not read results sequentially: they exhibit a **"lost in the middle"** effect, where accuracy is high for the first and last documents in the context but degrades for those in the middle. This means that classic metrics do not fully capture the impact of retrieval on generation quality. For RAG, it is useful to supplement retrieval metrics with end-to-end metrics such as faithfulness and answer relevancy, which can be measured using frameworks like RAGAS <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain RAGAS"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is RAGAS?</strong> It is an evaluation framework designed specifically for <strong>RAG</strong> pipelines. It is used to measure aspects such as faithfulness, answer relevancy, context precision, and context recall, often using an LLM as a judge.</span></span> or DeepEval <span class="inline-note"><button type="button" class="inline-note__trigger" aria-label="Explain DeepEval"><span aria-hidden="true">&#42;</span></button><span class="inline-note__popup"><strong>What is DeepEval?</strong> It is an evaluation library for LLM applications, including chatbots, agents, and RAG systems. It allows you to define automated tests and metrics to check response quality, grounding, correctness, and system behavior.</span></span>.

Building an evaluation dataset is an investment that pays off. Start with 50–100 queries representative of the users who will actually use the RAG system, annotate relevance judgments for the retrieved documents (binary or graded), and calculate the metric values as a baseline. Every change to the pipeline—whether it is a change in the embedding model, an adjustment of fusion weights, or the addition of a reranker—is evaluated against this baseline. Without this process, you are navigating blind.

## Costs, in order of importance

### Computational cost comes first

The most significant cost of hybrid search is not the provider's price: it is the computational cost of running two retrievers instead of one, maintaining two indices, and optionally adding a reranker.

**Indexing** is the "heaviest" item during the setup phase. Building an inverted index for BM25 is relatively inexpensive, even on a CPU. Building an HNSW index for dense vectors is significantly more expensive: it requires generating embeddings (which necessitates a GPU or paid APIs) and building the HNSW graph, which is CPU-intensive. To give an order of magnitude, indexing 24 million PubMed abstracts with only BM25 on Elasticsearch takes about 156 minutes on 16 cores; adding embeddings can double or triple that time.

**Storage** is a continuous cost. An inverted index remains relatively compact, whereas for vectors, the base cost is calculated mechanically: Azure documentation uses the formula [`documents × dimensions × bytes per value`](https://learn.microsoft.com/en-us/azure/search/vector-search-index-size). Therefore, a **768-dimension** vector in `float32` occupies **768 × 4 = 3,072 bytes**, or approximately **3 KB per document**. For **10 million documents**, this is already about **30.7 GB of raw vector payload**. For HNSW, there is also the index overhead: Microsoft reports an overhead of approximately **2%** in memory for uncompressed `float32` vectors at **768 dimensions** with `m=4`, which brings the total to about **31.3 GB** before accounting for deleted documents or additional copies. Furthermore, Azure notes that vector index storage **on disk** can be up to **3x** the size in memory, as the system maintains different copies for various purposes. [Quantization](https://learn.microsoft.com/en-us/azure/search/vector-search-index-size) (scalar or binary) and tighter numeric types significantly reduce this cost, while keeping an inverted index and a vector index together almost always means paying a double infrastructure cost.

**Query latency** is the metric perceived by the user, but it is best to be cautious here: numbers vary wildly depending on the corpus, filters, hardware, `efSearch`, `numCandidates`, and cache. As an order of magnitude, Elastic describes large-scale real-time retrieval as a problem that must remain under [**100 ms** per single search request](https://www.elastic.co/search-labs/blog/elasticsearch-vector-large-scale-part1). In a public benchmark on **20 million documents**, they report an [**average latency of 25 ms**](https://www.elastic.co/search-labs/blog/opensearch-vs-elasticsearch-filtered-vector-search/) for a filtered vector search configuration on Elasticsearch. Regarding reranking, we have a more concrete reference: Sentence Transformers documentation reports approximately [**1800 document pairs per second on a V100 GPU**](https://www.sbert.net/docs/pretrained-models/ce-msmarco.html?highlight=cross+encoder) for `cross-encoder/ms-marco-MiniLM-L6-v2`. This roughly equates to **11 ms** for 20 candidates and **28 ms** for 50 candidates, excluding application overhead. In practice, a well-optimized hybrid pipeline can remain within an interactive range, but reranking is often the first point where latency stops scaling well at high throughput.

### Commercial cost depends on the model

Provider pricing models are so diverse that a direct comparison is misleading without specifying the use case.

**Infrastructure-based** providers (Qdrant Cloud, Weaviate Cloud, Elasticsearch self-hosted, OpenSearch self-hosted) charge for allocated resources: CPU, RAM, and disk. Queries are unlimited once the cluster is provisioned. This model favors high-volume query workloads.

**Consumption-based** providers (Pinecone Serverless, Elastic Cloud Serverless, AWS OpenSearch Serverless) charge per operation or per unit of compute consumed. This model favors workloads with variable or low volumes but can become expensive as traffic increases.

**Additional costs** that are often overlooked include: embedding generation (API models like those from OpenAI cost approximately $0.02–$0.13 per million tokens), reranking (Cohere Rerank costs $1 per thousand searches), and the Azure AI Search semantic ranker, which has a per-query cost after the free tier.

As an indicative benchmark: a minimum configuration on Qdrant Cloud starts from the free tier (1 GB RAM); [Weaviate Cloud starts at $45 per month](https://weaviate.io/pricing); Azure AI Search Basic starts at approximately $75 per month; [AWS OpenSearch Serverless starts at approximately $350 per month](https://cloudchipr.com/blog/aws-opensearch-pricing); and Pinecone Standard starts at $50 per month with consumption-based costs.

### The cost of error is what no one budgets for

The most subtle cost is that of retrieval error. In a RAG system, retrieval that misses relevant documents produces incomplete answers or hallucinations. Retrieval that recovers misleading documents produces plausible but incorrect answers, which are worse than no answer at all. In our culinary app, returning a recipe with undeclared allergens because the retrieval failed to catch a filter is a risk that should absolutely not be underestimated.

Choosing a solution that is too simple—a single retriever without reranking, a single signal without fusion—may seem like a saving in complexity, but the cost manifests in the quality of the results.

On the other hand, over-engineering is a real risk. Adding complexity without evaluation creates opaque systems where problems are difficult to diagnose. The rule of thumb is: start with BM25 + dense + RRF as a baseline, measure, and only add complexity (reranking, calibrated weights, learned sparse) when the metrics justify it.

## Conclusion

Hybrid search is, at its core, a design principle: do not rely on a single signal, but evaluate two that function differently. Every retrieval method has predictable failure modes, and the intelligent combination of different signals produces a system that is more robust than any single component.

If there is one takeaway, it is this: keyword search is not dead, semantic search is not magic, and hybrid search is not just the sum of the two. It is an architecture that acknowledges the imperfection of every signal and transforms it into resilience. How you implement it—which provider you use, how you handle fusion, and what weights you apply—depends on your domain, volume, budget, and error tolerance. But the "why" is universal: systems that depend on a single retrieval signal are fragile, and sooner or later, you will pay the price for that fragility.