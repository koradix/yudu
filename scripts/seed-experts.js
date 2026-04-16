const https = require('https');

const sql = `
-- Atualizar expert_profiles com dados reais
UPDATE expert_profiles SET headline = 'Eletricista residencial e industrial · 12 anos', bio = 'Especialista em instalações elétricas residenciais e comerciais. Certificado NR10. Já formei mais de 30 aprendizes que hoje atuam no mercado.', rating_avg = 4.9, sessions_count = 127, response_time_hours = 2, is_active = true
WHERE user_id = 'aaaa0001-0001-0001-0001-000000000001';

UPDATE expert_profiles SET headline = 'UI/UX Designer · Figma · 8 anos', bio = 'Designer de interfaces com experiência em startups e grandes empresas. Apaixonada por ensinar design thinking na prática.', rating_avg = 4.8, sessions_count = 89, response_time_hours = 4, is_active = true
WHERE user_id = 'aaaa0002-0002-0002-0002-000000000002';

UPDATE expert_profiles SET headline = 'Mestre marceneiro · Móveis sob medida · 20 anos', bio = 'Marceneiro com duas décadas de experiência em móveis planejados. Ensino desde técnicas básicas até acabamento profissional.', rating_avg = 5.0, sessions_count = 203, response_time_hours = 6, is_active = true
WHERE user_id = 'aaaa0003-0003-0003-0003-000000000003';

UPDATE expert_profiles SET headline = 'Dev Full-Stack · React · Node.js · 6 anos', bio = 'Desenvolvedor com experiência em startups. Ensino programação do zero ao deploy, focado em projetos reais.', rating_avg = 4.7, sessions_count = 64, response_time_hours = 3, is_active = true
WHERE user_id = 'aaaa0004-0004-0004-0004-000000000004';

UPDATE expert_profiles SET headline = 'Barbeiro profissional · Cortes modernos · 9 anos', bio = 'Dono de barbearia com 3 cadeiras. Ensino corte masculino, barba e coloração para quem quer entrar na profissão.', rating_avg = 4.6, sessions_count = 156, response_time_hours = 1, is_active = true
WHERE user_id = 'aaaa0005-0005-0005-0005-000000000005';

UPDATE expert_profiles SET headline = 'Chef confeiteira · Gastronomia prática · 11 anos', bio = 'Formada em gastronomia com especialização em confeitaria francesa. Ensino desde bolos artesanais até sobremesas finas.', rating_avg = 4.9, sessions_count = 98, response_time_hours = 5, is_active = true
WHERE user_id = 'aaaa0006-0006-0006-0006-000000000006';

-- Avatars e verificação
UPDATE profiles SET is_verified = true, avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' WHERE id = 'aaaa0001-0001-0001-0001-000000000001';
UPDATE profiles SET is_verified = true, avatar_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' WHERE id = 'aaaa0002-0002-0002-0002-000000000002';
UPDATE profiles SET is_verified = true, avatar_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' WHERE id = 'aaaa0003-0003-0003-0003-000000000003';
UPDATE profiles SET is_verified = true, avatar_url = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face' WHERE id = 'aaaa0004-0004-0004-0004-000000000004';
UPDATE profiles SET is_verified = true, avatar_url = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' WHERE id = 'aaaa0005-0005-0005-0005-000000000005';
UPDATE profiles SET is_verified = true, avatar_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' WHERE id = 'aaaa0006-0006-0006-0006-000000000006';

-- Skills
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0001-0001-0001-0001-000000000001' AND s.slug = 'eletrica-residencial' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0001-0001-0001-0001-000000000001' AND s.slug = 'energia-solar' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0002-0002-0002-0002-000000000002' AND s.slug = 'ui-design' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0002-0002-0002-0002-000000000002' AND s.slug = 'figma' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0004-0004-0004-0004-000000000004' AND s.slug = 'react-nextjs' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0004-0004-0004-0004-000000000004' AND s.slug = 'typescript' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0005-0005-0005-0005-000000000005' AND s.slug = 'corte-masculino' ON CONFLICT DO NOTHING;
INSERT INTO expert_skills (expert_id, skill_id) SELECT ep.id, s.id FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0005-0005-0005-0005-000000000005' AND s.slug = 'barba' ON CONFLICT DO NOTHING;

-- Offers
INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'practical_experience', 'Instalação Elétrica Residencial', 'Aprenda a fazer instalação elétrica completa de um cômodo, incluindo fiação, tomadas e disjuntores.', 180.00, 120, 'in_person', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0001-0001-0001-0001-000000000001' AND s.slug = 'eletrica-residencial';

INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'hourly_mentoring', 'Mentoria em Energia Solar', 'Consultoria sobre dimensionamento e instalação de sistemas fotovoltaicos residenciais.', 250.00, 60, 'remote', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0001-0001-0001-0001-000000000001' AND s.slug = 'energia-solar';

INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'practical_experience', 'Workshop de UI Design', 'Crie um projeto real de interface do zero ao protótipo navegável no Figma.', 150.00, 90, 'remote', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0002-0002-0002-0002-000000000002' AND s.slug = 'ui-design';

INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'practical_experience', 'Projeto React do Zero ao Deploy', 'Construa uma aplicação web completa comigo. Do setup ao deploy na Vercel.', 200.00, 120, 'remote', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0004-0004-0004-0004-000000000004' AND s.slug = 'react-nextjs';

INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'hourly_mentoring', 'Code Review TypeScript', 'Revisão de código, boas práticas e arquitetura em projetos TypeScript.', 120.00, 60, 'remote', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0004-0004-0004-0004-000000000004' AND s.slug = 'typescript';

INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'practical_experience', 'Corte Masculino Profissional', 'Aprenda degradê, navalhado e social na barbearia real.', 90.00, 90, 'in_person', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0005-0005-0005-0005-000000000005' AND s.slug = 'corte-masculino';

INSERT INTO offers (expert_id, skill_id, offer_type, title, description, base_price, duration_min, location_type, is_active)
SELECT ep.id, s.id, 'service', 'Barba Completa + Ensino', 'Serviço de barba com explicação passo a passo de cada técnica.', 70.00, 60, 'in_person', true
FROM expert_profiles ep, skills s WHERE ep.user_id = 'aaaa0005-0005-0005-0005-000000000005' AND s.slug = 'barba';
`;

const body = JSON.stringify({ query: sql });
const req = https.request({
  hostname: 'api.supabase.com',
  path: '/v1/projects/rxwsnntneiblkwtsgmvh/database/query',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sbp_895ae63de7cb14d76b324ecad202ea2ba47bc64b',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log('Status:', res.statusCode, '|', data.substring(0, 200)));
});
req.write(body);
req.end();
