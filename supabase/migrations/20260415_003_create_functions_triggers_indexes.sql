-- Auto-atualiza updated_at em profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Recalcula rating do expert após cada avaliação
CREATE OR REPLACE FUNCTION update_expert_rating()
RETURNS TRIGGER AS $$
DECLARE ep_id UUID;
BEGIN
  SELECT id INTO ep_id FROM expert_profiles WHERE user_id = NEW.reviewee_id;
  IF ep_id IS NOT NULL THEN
    UPDATE expert_profiles
    SET rating_avg = (
      SELECT ROUND(AVG(r.rating)::NUMERIC, 2)
      FROM reviews r JOIN sessions s ON r.session_id = s.id
      WHERE s.expert_id = ep_id
    ) WHERE id = ep_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_expert_rating
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_expert_rating();

-- Cria perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  r user_role;
  n TEXT;
BEGIN
  r := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'learner');
  n := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  INSERT INTO profiles (id, role, full_name, email) VALUES (NEW.id, r, n, NEW.email);
  IF r = 'learner' THEN INSERT INTO learner_profiles (user_id) VALUES (NEW.id);
  ELSIF r = 'expert' THEN INSERT INTO expert_profiles (user_id) VALUES (NEW.id);
  ELSIF r = 'client' THEN INSERT INTO client_profiles (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Índices de performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_expert_profiles_rating ON expert_profiles(rating_avg DESC);
CREATE INDEX idx_offers_expert ON offers(expert_id);
CREATE INDEX idx_offers_skill ON offers(skill_id);
CREATE INDEX idx_offers_active ON offers(is_active);
CREATE INDEX idx_sessions_expert ON sessions(expert_id);
CREATE INDEX idx_sessions_learner ON sessions(learner_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
