-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_skill_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "profiles: leitura publica" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles: escrita propria" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "expert_profiles: leitura publica" ON expert_profiles FOR SELECT USING (true);
CREATE POLICY "expert_profiles: escrita propria" ON expert_profiles FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "learner_profiles: escrita propria" ON learner_profiles FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "learner_profiles: leitura propria" ON learner_profiles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "client_profiles: escrita propria" ON client_profiles FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "offers: leitura publica" ON offers FOR SELECT USING (is_active = true);
CREATE POLICY "offers: escrita expert" ON offers FOR ALL USING (expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid()));

CREATE POLICY "sessions: leitura envolvidos" ON sessions FOR SELECT USING (
  expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
  OR learner_id IN (SELECT id FROM learner_profiles WHERE user_id = auth.uid())
  OR client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "session_requests: leitura envolvidos" ON session_requests FOR SELECT USING (
  requester_id = auth.uid()
  OR offer_id IN (SELECT o.id FROM offers o JOIN expert_profiles ep ON o.expert_id = ep.id WHERE ep.user_id = auth.uid())
);
CREATE POLICY "session_requests: criar" ON session_requests FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "payments: leitura propria" ON payments FOR SELECT USING (payer_id = auth.uid());
CREATE POLICY "reviews: leitura publica" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews: escrita propria" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "messages: leitura propria" ON messages FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "messages: enviar" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "skills: publica" ON skills FOR SELECT USING (true);
CREATE POLICY "skill_categories: publica" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "expert_skills: publica" ON expert_skills FOR SELECT USING (true);

-- Seed de categorias e habilidades
INSERT INTO skill_categories (name, slug, type, icon_name, color_token) VALUES
  ('Design', 'design', 'digital', 'Palette', 'purple'),
  ('Desenvolvimento', 'desenvolvimento', 'digital', 'Code2', 'purple'),
  ('Vídeo e Mídia', 'video-midia', 'digital', 'Video', 'purple'),
  ('Marketing Digital', 'marketing-digital', 'digital', 'TrendingUp', 'purple'),
  ('No-Code', 'no-code', 'digital', 'Zap', 'purple'),
  ('Fotografia', 'fotografia', 'digital', 'Camera', 'purple'),
  ('Marcenaria', 'marcenaria', 'physical', 'Hammer', 'teal'),
  ('Elétrica', 'eletrica', 'physical', 'Zap', 'teal'),
  ('Hidráulica', 'hidraulica', 'physical', 'Droplets', 'teal'),
  ('Barbearia', 'barbearia', 'physical', 'Scissors', 'teal'),
  ('Culinária', 'culinaria', 'physical', 'ChefHat', 'teal'),
  ('Pintura', 'pintura', 'physical', 'Paintbrush', 'teal'),
  ('Mecânica', 'mecanica', 'physical', 'Wrench', 'teal');

INSERT INTO skills (category_id, name, slug)
SELECT c.id, s.name, s.slug FROM skill_categories c,
(VALUES ('UI Design','ui-design'),('UX Research','ux-research'),('Figma','figma'),('Motion Design','motion-design'),('Branding','branding')) AS s(name,slug)
WHERE c.slug = 'design';

INSERT INTO skills (category_id, name, slug)
SELECT c.id, s.name, s.slug FROM skill_categories c,
(VALUES ('React / Next.js','react-nextjs'),('Python','python'),('Node.js','nodejs'),('TypeScript','typescript'),('SQL','sql')) AS s(name,slug)
WHERE c.slug = 'desenvolvimento';

INSERT INTO skills (category_id, name, slug)
SELECT c.id, s.name, s.slug FROM skill_categories c,
(VALUES ('Corte Masculino','corte-masculino'),('Barba','barba'),('Coloração','coloracao')) AS s(name,slug)
WHERE c.slug = 'barbearia';

INSERT INTO skills (category_id, name, slug)
SELECT c.id, s.name, s.slug FROM skill_categories c,
(VALUES ('Elétrica Residencial','eletrica-residencial'),('Instalação de Ar-Condicionado','ar-condicionado'),('Energia Solar','energia-solar')) AS s(name,slug)
WHERE c.slug = 'eletrica';
