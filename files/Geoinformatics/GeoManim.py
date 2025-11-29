from manim import *
import numpy as np

class RadarEquationScene(Scene):
    def construct(self):
        # --- 1. Titolo ---
        title = Text("GNSS-R: Equazione Radar Bistatica", font_size=36).to_edge(UP)
        self.play(Write(title))

        # --- 2. L'Equazione ---
        # Scriviamo l'equazione usando LaTeX
        equation = MathTex(
            r"P_r(\tau, f_D) = \frac{P_t G_t \lambda^2}{(4\pi)^3} \iint_A \frac{G_r \sigma^0 \chi^2}{R_t^2 R_r^2} \, d\vec{r}",
            font_size=34
        )
        self.play(Write(equation))
        self.wait(1)

        # Spostiamo l'equazione in alto per fare spazio alla spiegazione
        self.play(equation.animate.shift(UP * 2))

        # --- 3. Evidenziare i termini chiave ---
        # Definiamo i rettangoli di evidenziazione e le descrizioni
        
        # Termine Sigma0 (Coefficiente di scattering)
        frame_sigma = SurroundingRectangle(equation[0][18:20], buff=0.1, color=YELLOW)
        label_sigma = Text("Coefficiente di scattering\n(Proprietà della superficie)", font_size=24, color=YELLOW)
        label_sigma.next_to(frame_sigma, DOWN * 2)
        
        self.play(Create(frame_sigma), FadeIn(label_sigma))
        self.wait(2)
        self.play(FadeOut(frame_sigma), FadeOut(label_sigma))

        # Termine Chi^2 (Funzione di Ambiguità)
        frame_chi = SurroundingRectangle(equation[0][20:22], buff=0.1, color=BLUE)
        label_chi = Text("Funzione di Ambiguità\n(Risposta del sistema)", font_size=24, color=BLUE)
        label_chi.next_to(frame_chi, DOWN * 2)

        self.play(Create(frame_chi), FadeIn(label_chi))
        self.wait(2)
        self.play(FadeOut(frame_chi), FadeOut(label_chi))

        # Termini R (Distanze geometriche)
        frame_R = SurroundingRectangle(equation[0][23:28], buff=0.1, color=RED)
        label_R = Text("Geometria Bistatica\n(Distanze Tx e Rx)", font_size=24, color=RED)
        label_R.next_to(frame_R, DOWN * 2)

        self.play(Create(frame_R), FadeIn(label_R))
        self.wait(2)
        
        # Pulizia finale
        self.play(FadeOut(frame_R), FadeOut(label_R), FadeOut(equation), FadeOut(title))


class DDMVisualization(ThreeDScene):
    def construct(self):
        # --- Setup Assi 3D ---
        axes = ThreeDAxes(
            x_range=[-4, 4, 1],
            y_range=[-4, 4, 1],
            z_range=[0, 6, 2],
            x_length=7,
            y_length=7,
            z_length=4,
        ).add_coordinates()
        
        # Etichette assi
        labels = axes.get_axis_labels(
            x_label=MathTex("f_D"), # Doppler
            y_label=MathTex(r"\tau"), # Delay
            z_label=MathTex("P_r")  # Potenza
        )

        self.set_camera_orientation(phi=75 * DEGREES, theta=30 * DEGREES)
        self.play(Create(axes), Create(labels))

        # --- DEFINIZIONE DELLE SUPERFICI DDM ---
        
        # 1. Superficie Calma (Picco speculare concentrato)
        # Usiamo una Gaussiana stretta 2D
        def calm_surface_func(u, v):
            z = 5 * np.exp(-(u**2 + v**2) * 5)
            return axes.c2p(u, v, z)

        calm_surface = Surface(
            calm_surface_func,
            u_range=[-3, 3],
            v_range=[-3, 3],
            resolution=(30, 30),
            fill_opacity=0.8,
            checkerboard_colors=[BLUE_D, BLUE_E],
            stroke_color=BLUE_A,
            stroke_width=0.5
        )

        # 2. Superficie Rugosa (Il "Ferro di Cavallo")
        # Simuliamo la dispersione: l'energia si sposta verso delay maggiori (v) 
        # e si allarga in doppler (u). 
        # La forma a ferro di cavallo implica che a delay maggiori, il doppler si allarga.
        def rough_surface_func(u, v):
            # Shift del delay (v) per visualizzazione
            delay_offset = v + 1.5 
            if delay_offset < 0: return axes.c2p(u,v,0)
            
            # Equazione euristica per la forma a ferro di cavallo:
            # L'energia decade, ma segue una curva parabolica nel piano delay-doppler
            spread = 1 + delay_offset * 2 # Più ritardo = più dispersione doppler
            base_power = 3.5 * np.exp(-delay_offset) # Potenza cala col ritardo
            
            # Forma U: 
            shape = np.exp(-(u**2) / spread) 
            
            z = base_power * shape
            return axes.c2p(u, v, z)

        rough_surface = Surface(
            rough_surface_func,
            u_range=[-3, 3],
            v_range=[-3, 3],
            resolution=(30, 30),
            fill_opacity=0.7,
            checkerboard_colors=[TEAL_D, TEAL_E], # Colore diverso per indicare cambiamento
            stroke_color=TEAL_A,
            stroke_width=0.5
        )

        # --- ANIMAZIONE ---

        # 1. Mostra Acqua Calma
        t1 = Text("Superficie Calma (Speculare)", font_size=24).to_corner(UL)
        self.add_fixed_in_frame_mobjects(t1)
        self.play(Write(t1))
        self.play(Create(calm_surface))
        self.wait(1)
        
        # Ruota la camera per apprezzare il picco
        self.move_camera(phi=60 * DEGREES, theta=60 * DEGREES, run_time=2)

        # 2. Transizione a Mare Agitato (Ferro di cavallo)
        t2 = Text("Superficie Rugosa (Vento alto)", font_size=24, color=TEAL).to_corner(UL)
        t3 = Text("Forma a 'Ferro di Cavallo'", font_size=20, slant=ITALIC).next_to(t2, DOWN)
        
        self.play(
            Transform(calm_surface, rough_surface),
            FadeOut(t1),
            FadeIn(t2),
            FadeIn(t3),
            run_time=3
        )
        
        # Ruota per vedere la forma dall'alto (vista mappa)
        self.move_camera(phi=0 * DEGREES, theta=-90 * DEGREES, run_time=3)
        self.wait(2)