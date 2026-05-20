-- Tabela de Tecnicos
CREATE TABLE IF NOT EXISTS public.tecnicos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categorias (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    text_color TEXT NOT NULL,
    border_color TEXT NOT NULL,
    dot_color TEXT NOT NULL,
    accent_color TEXT NOT NULL
);

-- Tabela de Status
CREATE TABLE IF NOT EXISTS public.statuses (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    text_color TEXT NOT NULL
);

-- Tabela de Tickets
CREATE TABLE IF NOT EXISTS public.tickets (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    category TEXT REFERENCES public.categorias(id) ON DELETE SET NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Crítica', 'Alta', 'Média', 'Baixa')),
    status TEXT REFERENCES public.statuses(id) ON DELETE SET NULL,
    assignee TEXT REFERENCES public.tecnicos(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Inserir dados iniciais (Exemplos)
-- Tecnicos
INSERT INTO public.tecnicos (id, nome) VALUES
('tec01', 'Carlos Silva'),
('tec02', 'Ana Oliveira'),
('tec03', 'Rafael Santos')
ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome;

-- Categorias
INSERT INTO public.categorias (id, label, bg_color, text_color, border_color, dot_color, accent_color) VALUES
('ti', 'Informática/TI', '#d8e3fb', '#091426', '#bcc7de', '#091426', '#091426'),
('eletrica', 'Elétrica', '#fadfb8', '#35260c', '#ddc39d', '#35260c', '#35260c'),
('predial', 'Predial/Civil', '#e4e2e3', '#1b1b1d', '#c5c6cd', '#545f73', '#545f73'),
('seguranca', 'Segurança Eletrônica', '#f3f0f2', '#303032', '#c5c6cd', '#303032', '#303032'),
('telecom', 'Telecomunicações', '#dfe2ed', '#181c23', '#c3c6d1', '#5b5e67', '#5b5e67')
ON CONFLICT (id) DO NOTHING;

-- Statuses
INSERT INTO public.statuses (id, label, bg_color, text_color) VALUES
('Em Progresso', 'Em Progresso', '#d8e3fb', '#111c2d'),
('Pendente', 'Pendente', '#e4e2e3', '#45474c'),
('Validando', 'Validando', '#dfe2ed', '#61646d'),
('Aguardando Peças', 'Aguardando Peças', '#fadfb8', '#35260c'),
('Concluído', 'Concluído', '#bcc7de', '#091426')
ON CONFLICT (id) DO NOTHING;

-- Tickets
INSERT INTO public.tickets (id, subject, category, priority, status, assignee, created_at, updated_at) VALUES
(1024, 'Manutenção de nobreak na sala 4', 'ti', 'Crítica', 'Em Progresso', 'tec01', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days'),
(1023, 'Substituição de switch core (Rack B)', 'ti', 'Alta', 'Pendente', 'tec02', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '9 days'),
(1022, 'Infiltração no teto do corredor principal', 'predial', 'Média', 'Validando', 'tec01', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day'),
(1021, 'Câmera de segurança (Portão 2) off-line', 'seguranca', 'Baixa', 'Pendente', 'tec03', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '6 days'),
(1020, 'Configuração de VPN para usuário remoto', 'ti', 'Alta', 'Em Progresso', 'tec02', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '11 days'),
(1019, 'Troca de lâmpadas do estacionamento', 'eletrica', 'Média', 'Aguardando Peças', 'tec01', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days'),
(1018, 'Reparo no ar-condicionado do data center', 'ti', 'Crítica', 'Em Progresso', 'tec03', CURRENT_DATE - INTERVAL '1 days', CURRENT_DATE),
(1017, 'Atualização de firmware dos roteadores', 'ti', 'Alta', 'Concluído', 'tec01', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '12 days'),
(1016, 'Instalação de tomadas na sala de reunião', 'eletrica', 'Média', 'Pendente', 'tec02', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '7 days'),
(1015, 'Recuperação de backup do servidor financeiro', 'ti', 'Crítica', 'Validando', 'tec01', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days'),
(1014, 'Substituição de bateria do alarme', 'seguranca', 'Baixa', 'Pendente', 'tec03', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '5 days'),
(1013, 'Manutenção preventiva do gerador', 'eletrica', 'Média', 'Em Progresso', 'tec01', CURRENT_DATE - INTERVAL '9 days', CURRENT_DATE - INTERVAL '8 days'),
(1012, 'Liberação de acesso ao sistema ERP', 'ti', 'Alta', 'Concluído', 'tec02', CURRENT_DATE - INTERVAL '11 days', CURRENT_DATE - INTERVAL '10 days'),
(1011, 'Troca de fechadura da porta principal', 'predial', 'Média', 'Pendente', 'tec01', CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE - INTERVAL '12 days'),
(1010, 'Reparo na rede elétrica do almoxarifado', 'eletrica', 'Baixa', 'Aguardando Peças', 'tec03', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days'),
(1009, 'Configuração de novo ponto de acesso Wi-Fi', 'ti', 'Média', 'Em Progresso', 'tec02', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '2 days'),
(1008, 'Substituição de HD do servidor de arquivos', 'ti', 'Alta', 'Validando', 'tec01', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '6 days'),
(1007, 'Vistoria técnica na subestação', 'eletrica', 'Crítica', 'Pendente', 'tec03', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days'),
(1006, 'Instalação de software antivírus', 'ti', 'Média', 'Concluído', 'tec01', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '11 days'),
(1005, 'Reparação no sistema de sprinklers', 'predial', 'Baixa', 'Pendente', 'tec02', CURRENT_DATE - INTERVAL '1 days', CURRENT_DATE),
(1004, 'Migração de caixa de e-mail corporativo', 'ti', 'Alta', 'Em Progresso', 'tec01', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '7 days'),
(1003, 'Troca de sensor de presença', 'seguranca', 'Média', 'Validando', 'tec02', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '9 days'),
(1002, 'Manutenção no elevator do prédio B', 'predial', 'Média', 'Pendente', 'tec03', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '5 days'),
(1001, 'Configuração de roteamento VoIP', 'telecom', 'Alta', 'Em Progresso', 'tec01', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days'),
(1000, 'Substituição de nobreak do rack principal', 'eletrica', 'Crítica', 'Aguardando Peças', 'tec02', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days'),
(999, 'Teste de carga no gerador de emergência', 'eletrica', 'Média', 'Concluído', 'tec01', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '13 days'),
(998, 'Homologação de novo link de internet', 'telecom', 'Alta', 'Em Progresso', 'tec03', CURRENT_DATE - INTERVAL '9 days', CURRENT_DATE - INTERVAL '8 days'),
(997, 'Instalação de catracas de acesso', 'seguranca', 'Baixa', 'Pendente', 'tec01', CURRENT_DATE - INTERVAL '11 days', CURRENT_DATE - INTERVAL '10 days'),
(996, 'Reparo no datashow da sala 12', 'ti', 'Média', 'Concluído', 'tec02', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '6 days'),
(995, 'Atualização cadastral no sistema de RH', 'ti', 'Alta', 'Validando', 'tec01', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Ajustar a sequência do ID para que novos inserts comecem após o maior ID atual
SELECT setval('tickets_id_seq', 1025, false);
