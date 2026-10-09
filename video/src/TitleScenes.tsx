import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from './theme';
import {Frame, Pill, formatInt, useCount, useReveal} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const H1: React.CSSProperties = {fontSize: 96, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2};
const H2: React.CSSProperties = {fontSize: 72, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5};
const BODY: React.CSSProperties = {fontSize: 34, lineHeight: 1.4};

const Column: React.FC<{children: React.ReactNode; top?: number; gap?: number; center?: boolean}> = ({
  children,
  top = 180,
  gap = 32,
  center,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      top: center ? 0 : top,
      bottom: center ? 0 : undefined,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: center ? 'center' : 'flex-start',
      gap,
    }}
  >
    {children}
  </div>
);

// 1. Gancho: a dor da agência, contada como história.
export const Hook: React.FC = () => {
  const a = useReveal(4);
  const b = useReveal(34);
  const c = useReveal(70);
  const d = useReveal(110);
  return (
    <Frame tone="navy">
      <Column center gap={36}>
        <div style={{...a, fontSize: 26, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color: colors.cyan}}>
          23h · Sua agência
        </div>
        <div style={{...b, ...H1, color: colors.white}}>Seu cliente precisa voar amanhã.</div>
        <div style={{...c, fontSize: 56, fontWeight: 600, color: colors.mist}}>A tarifa convencional: R$ 800.</div>
        <div style={{...d, fontSize: 56, fontWeight: 700, color: colors.cyan}}>E se você tivesse outra alternativa?</div>
      </Column>
    </Frame>
  );
};

// 2. Marca: a promessa da apresentação.
export const Brand: React.FC = () => {
  const a = useReveal(2);
  const b = useReveal(20);
  const c = useReveal(38);
  const d = useReveal(56);
  return (
    <Frame tone="navy" eyebrow="Proposta de parceria estratégica" accentBar>
      <Column center gap={28}>
        <div style={a}>
          <Pill dark>Plataforma B2B</Pill>
        </div>
        <div style={{...b, fontSize: 132, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, color: colors.white}}>
          Mais resultado no aéreo.
        </div>
        <div style={{...c, fontSize: 64, fontWeight: 700, lineHeight: 1.15, color: colors.cyan}}>
          Uma parceria à altura da sua operação.
        </div>
        <div style={{...d, ...BODY, color: colors.mist}}>
          Milhas e tarifas convencionais. Tecnologia e apoio humano à emissão.
        </div>
      </Column>
    </Frame>
  );
};

const Bullet: React.FC<{title: string; text: string; delay: number}> = ({title, text, delay}) => {
  const r = useReveal(delay, 20);
  return (
    <div style={{...r, display: 'flex', gap: 24, paddingBottom: 26, borderBottom: `1px solid ${colors.navyLine}`}}>
      <div style={{width: 14, height: 14, borderRadius: 7, background: colors.cyan, marginTop: 18, flex: 'none'}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <div style={{fontSize: 40, fontWeight: 700, color: colors.white}}>{title}</div>
        <div style={{fontSize: 30, color: colors.mist}}>{text}</div>
      </div>
    </div>
  );
};

// 3. Base operacional: números institucionais.
export const Base: React.FC = () => {
  const title = useReveal(0);
  const years = useCount(12, 14);
  const agencies = useCount(4000, 30, 44);
  const s1 = useReveal(14);
  const s2 = useReveal(30);
  return (
    <Frame tone="navy" eyebrow="Base operacional" footnote="Indicadores institucionais da Voe Pontos, outubro de 2026.">
      <Column top={170} gap={48}>
        <div style={{...title, ...H2, color: colors.white}}>Uma plataforma com operação por trás.</div>
        <div style={{display: 'flex', gap: 96}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 40}}>
            <div style={s1}>
              <div style={{fontSize: 160, fontWeight: 800, lineHeight: 1, letterSpacing: -4, color: colors.cyan}}>
                {formatInt(years)}+
              </div>
              <div style={{fontSize: 40, fontWeight: 700, color: colors.white}}>anos de experiência</div>
              <div style={{fontSize: 28, color: colors.mist}}>no mercado de emissão de passagens com milhas.</div>
            </div>
            <div style={s2}>
              <div style={{fontSize: 160, fontWeight: 800, lineHeight: 1, letterSpacing: -4, color: colors.cyan}}>
                {formatInt(agencies)}+
              </div>
              <div style={{fontSize: 40, fontWeight: 700, color: colors.white}}>agências atendidas</div>
              <div style={{fontSize: 28, color: colors.mist}}>na operação B2B da Voe Pontos.</div>
            </div>
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 26, paddingTop: 20}}>
            <Bullet delay={50} title="Foco B2B" text="Atuação voltada à parceria com agências de viagens." />
            <Bullet delay={64} title="Fornecimento de milhas" text="A agência não precisa manter estoque de pontos." />
            <Bullet delay={78} title="Suporte humano" text="Emissores no grupo dedicado de atendimento da agência." />
          </div>
        </div>
      </Column>
    </Frame>
  );
};

// 4. Credenciais (sem logotipos de terceiros).
export const Credentials: React.FC = () => {
  const a = useReveal(0);
  const b = useReveal(22);
  const c = useReveal(44);
  const ten = useCount(10, 22, 30);
  return (
    <Frame
      tone="light"
      eyebrow="Credenciais"
      footnote="Informações institucionais da Voe Pontos, outubro de 2026."
    >
      <Column top={190} gap={56}>
        <div style={{...a, ...H2, color: colors.ink}}>
          Escolhida por quem mais emite.
          <br />
          Parceira de quem é referência.
        </div>
        <div style={{...b, display: 'flex', alignItems: 'center', gap: 48}}>
          <div style={{fontSize: 200, fontWeight: 800, lineHeight: 1, letterSpacing: -6, color: colors.teal}}>
            {formatInt(ten)}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <Pill>Somos fonte primária de abastecimento das</Pill>
            <div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.3, color: colors.ink, width: 1100}}>
              maiores empresas de grande porte do mercado de emissão de passagens.
            </div>
          </div>
        </div>
        <div style={{...c, background: colors.navy, color: colors.white, fontSize: 34, padding: '26px 36px'}}>
          O mesmo abastecimento dos maiores emissores do mercado, agora a serviço da sua agência.
        </div>
      </Column>
    </Frame>
  );
};

const FlowStep: React.FC<{label: string; delay: number; last?: boolean}> = ({label, delay, last}) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [delay, delay + 10], [0, 1], clamp);
  const arrow = interpolate(frame, [delay + 8, delay + 22], [0, 1], clamp);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, flex: last ? 'none' : 1}}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          background: last ? colors.red : colors.teal,
          transform: `scale(${0.4 + 0.6 * on})`,
          opacity: on,
        }}
      />
      <div style={{fontSize: 40, fontWeight: 700, color: colors.ink, opacity: on}}>{label}</div>
      {last ? null : (
        <div style={{flex: 1, height: 3, background: colors.line, marginLeft: 12, marginRight: 24}}>
          <div style={{width: `${arrow * 100}%`, height: 3, background: colors.teal}} />
        </div>
      )}
    </div>
  );
};

// 6. Divisão de papéis + fluxo da emissão.
export const Team: React.FC = () => {
  const a = useReveal(0);
  const b = useReveal(16);
  const c = useReveal(28);
  const d = useReveal(130);
  return (
    <Frame
      tone="light"
      eyebrow="Tecnologia + equipe de emissão"
      footnote="Solicitação de compra não equivale a bilhete emitido."
    >
      <Column top={170} gap={52}>
        <div style={{...a, ...H2, color: colors.ink}}>
          Sua equipe vende.
          <br />A nossa equipe cuida da emissão.
        </div>
        <div style={{display: 'flex', gap: 44}}>
          <div style={{...b, flex: 1, background: colors.navy, padding: 44, display: 'flex', flexDirection: 'column', gap: 18}}>
            <div><Pill dark>Sua agência</Pill></div>
            <div style={{fontSize: 46, fontWeight: 700, color: colors.white}}>Estratégia e relacionamento</div>
            <div style={{fontSize: 30, lineHeight: 1.4, color: colors.mist}}>
              Escolhe a alternativa de voo, informa os dados e conduz a venda e o contato com o cliente.
            </div>
          </div>
          <div
            style={{
              ...c,
              flex: 1,
              background: colors.white,
              border: `1px solid ${colors.line}`,
              padding: 44,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div><Pill>Voe Pontos</Pill></div>
            <div style={{fontSize: 46, fontWeight: 700, color: colors.ink}}>Milhas e execução</div>
            <div style={{fontSize: 30, lineHeight: 1.4, color: colors.slate}}>
              Fornece as milhas, processa a solicitação, realiza a emissão e presta suporte à agência.
            </div>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <FlowStep label="Solicitação" delay={50} />
          <FlowStep label="Validação" delay={70} />
          <FlowStep label="Emissão" delay={90} />
          <FlowStep label="Bilhete" delay={110} last />
        </div>
        <div style={{...d, fontSize: 30, color: colors.slate}}>Atendimento humano em grupo dedicado à sua agência.</div>
      </Column>
    </Frame>
  );
};

const SimRow: React.FC<{label: string; value: string; delay: number; strong?: boolean}> = ({label, value, delay, strong}) => {
  const r = useReveal(delay, 16);
  return (
    <div
      style={{
        ...r,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '26px 0',
        borderBottom: `1px solid ${colors.line}`,
      }}
    >
      <div style={{fontSize: 34, color: colors.slate}}>{label}</div>
      <div style={{fontSize: 60, fontWeight: 800, letterSpacing: -1, color: strong ? colors.teal : colors.ink}}>{value}</div>
    </div>
  );
};

// 7. Simulação ilustrativa da diferença de compra.
export const Simulation: React.FC = () => {
  const a = useReveal(0);
  const sub = useReveal(10);
  const box = useReveal(84);
  const diff = useCount(240, 92, 40);
  const end = useReveal(150);
  return (
    <Frame
      tone="light"
      eyebrow="Simulação ilustrativa"
      footnote="Hipótese de condições comparáveis; não é cotação, média de mercado ou promessa de resultado. Diferença bruta antes de tributos, taxas e custos."
    >
      <Column top={160} gap={22}>
        <div style={{...a, ...H2, color: colors.ink}}>
          A diferença de compra pode
          <br />
          virar preço e resultado.
        </div>
        <div style={{...sub, fontSize: 32, color: colors.slate}}>
          Um exemplo para demonstrar a lógica comercial — não uma economia garantida.
        </div>
        <div style={{display: 'flex', gap: 64, marginTop: 20}}>
          <div style={{flex: 1}}>
            <SimRow label="Tarifa convencional de referência" value="R$ 800" delay={24} />
            <SimRow label="Custo via Voe Pontos no exemplo" value="R$ 520" delay={44} />
            <SimRow label="Preço de venda escolhido pela agência" value="R$ 760" delay={64} strong />
          </div>
          <div
            style={{
              ...box,
              width: 680,
              background: colors.navy,
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: colors.cyan}}>
              Diferença bruta por bilhete
            </div>
            <div style={{fontSize: 150, fontWeight: 800, letterSpacing: -4, lineHeight: 1.05, color: colors.white}}>
              R$ {formatInt(diff)}
            </div>
            <div style={{fontSize: 30, color: colors.mist}}>R$ 760 de venda − R$ 520 de compra</div>
          </div>
        </div>
        <div style={{...end, fontSize: 34, fontWeight: 700, color: colors.ink, marginTop: 12}}>
          E o cliente paga R$ 40 abaixo da referência convencional.
        </div>
      </Column>
    </Frame>
  );
};

const ScaleCard: React.FC<{tickets: number; delay: number}> = ({tickets, delay}) => {
  const r = useReveal(delay);
  const value = useCount((tickets * 240) / 1000, delay + 6, 34);
  return (
    <div style={{...r, flex: 1, background: colors.navyCard, border: `1px solid ${colors.navyLine}`, padding: 44, display: 'flex', flexDirection: 'column', gap: 20}}>
      <div style={{fontSize: 40, fontWeight: 700, color: colors.mist}}>{tickets} bilhetes</div>
      <div style={{fontSize: 92, fontWeight: 800, letterSpacing: -2, color: colors.cyan}}>R$ {formatInt(value)} mil</div>
      <div style={{fontSize: 28, color: colors.mist}}>diferença bruta acumulada</div>
    </div>
  );
};

// 8. Escala: análise de sensibilidade.
export const Scale: React.FC = () => {
  const a = useReveal(0);
  const b = useReveal(10);
  const c = useReveal(100);
  return (
    <Frame
      tone="navy"
      eyebrow="Escala · análise de sensibilidade"
      footnote="Cálculo ilustrativo: quantidade de bilhetes × R$ 240. Não representa previsão de volume, rentabilidade ou resultado líquido."
    >
      <Column top={170} gap={36}>
        <div style={{...a, ...H2, color: colors.white}}>
          Em uma operação com volume,
          <br />o efeito precisa ser medido.
        </div>
        <div style={{...b, fontSize: 32, color: colors.mist}}>
          Mantendo, apenas para ilustrar, R$ 240 de diferença bruta por bilhete:
        </div>
        <div style={{display: 'flex', gap: 36, marginTop: 16}}>
          <ScaleCard tickets={100} delay={22} />
          <ScaleCard tickets={300} delay={40} />
          <ScaleCard tickets={500} delay={58} />
        </div>
        <div style={{...c, fontSize: 32, fontWeight: 700, color: colors.white}}>
          O próximo passo é substituir a hipótese por cotações reais da sua agência.
        </div>
      </Column>
    </Frame>
  );
};

const NoCard: React.FC<{title: string; text: string; delay: number}> = ({title, text, delay}) => {
  const frame = useCurrentFrame();
  const r = useReveal(delay, 24);
  const pop = interpolate(frame, [delay, delay + 14], [0.92, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <div
      style={{
        ...r,
        transform: `${r.transform} scale(${pop})`,
        flex: 1,
        background: colors.white,
        border: `1px solid ${colors.line}`,
        borderTop: `5px solid ${colors.teal}`,
        padding: 36,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{fontSize: 72, fontWeight: 800, letterSpacing: -2, color: colors.ink}}>Sem</div>
      <div style={{fontSize: 36, fontWeight: 700, color: colors.ink}}>{title}</div>
      <div style={{fontSize: 28, lineHeight: 1.35, color: colors.slate}}>{text}</div>
    </div>
  );
};

// 9. Condições comerciais.
export const Conditions: React.FC = () => {
  const a = useReveal(0);
  const b = useReveal(96);
  return (
    <Frame
      tone="light"
      eyebrow="Condições comerciais"
      footnote="Faturamento, limite e prazo sujeitos à análise e aprovação."
    >
      <Column top={170} gap={56}>
        <div style={{...a, ...H2, color: colors.ink}}>
          Uma entrada simples.
          <br />
          Uma relação para construir resultado.
        </div>
        <div style={{display: 'flex', gap: 32}}>
          <NoCard delay={20} title="mensalidade" text="Sem custo mensal de acesso." />
          <NoCard delay={34} title="taxa de adesão" text="Sem cobrança para começar." />
          <NoCard delay={48} title="volume mínimo" text="Uso conforme a sua demanda." />
          <NoCard delay={62} title="exclusividade" text="Complementa seus fornecedores atuais." />
        </div>
        <div style={{...b, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{fontSize: 40, fontWeight: 800, color: colors.ink}}>Crédito e faturamento alinhados ao perfil da agência.</div>
          <div style={{fontSize: 30, color: colors.slate}}>
            Cadastro, análise e definição de limite e prazo antes da modalidade faturada.
          </div>
        </div>
      </Column>
    </Frame>
  );
};

const ActStep: React.FC<{n: string; title: string; text: string; delay: number}> = ({n, title, text, delay}) => {
  const r = useReveal(delay, 20);
  return (
    <div style={{...r, flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          background: colors.navy,
          color: colors.white,
          fontSize: 32,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n}
      </div>
      <div style={{fontSize: 40, fontWeight: 800, color: colors.ink}}>{title}</div>
      <div style={{fontSize: 30, lineHeight: 1.35, color: colors.slate, paddingRight: 24}}>{text}</div>
    </div>
  );
};

// 10. Ativação acompanhada.
export const Activation: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useReveal(0);
  const line = interpolate(frame, [16, 90], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <Frame tone="light" eyebrow="Ativação acompanhada">
      <Column top={190} gap={80}>
        <div style={{...a, ...H2, color: colors.ink}}>
          Da ativação à primeira emissão,
          <br />
          com a equipe acompanhando.
        </div>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', left: 44, right: 300, top: 43, height: 3, background: colors.line}}>
            <div style={{width: `${line * 100}%`, height: 3, background: colors.teal}} />
          </div>
          <div style={{display: 'flex', gap: 24, position: 'relative'}}>
            <ActStep delay={14} n="01" title="Ficha cadastral" text="Cadastro com apoio da equipe comercial." />
            <ActStep delay={34} n="02" title="Análise e condições" text="Definição de crédito, limite e prazo." />
            <ActStep delay={54} n="03" title="Acessos e treino" text="Credenciais do buscador e grupo de atendimento." />
            <ActStep delay={74} n="04" title="Primeira emissão" text="Acompanhamento até a entrega do bilhete." />
          </div>
        </div>
      </Column>
    </Frame>
  );
};

// 11. Frase de impacto.
export const Statement: React.FC = () => {
  const a = useReveal(4);
  const b = useReveal(40);
  return (
    <Frame tone="navy" accentBar>
      <Column center gap={44}>
        <div style={{...a, fontSize: 108, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2.5, color: colors.white}}>
          Uma parceria se constrói
          <br />
          com resultado demonstrado.
        </div>
        <div style={{...b, fontSize: 40, lineHeight: 1.4, color: colors.mist}}>
          Começamos pelas rotas que sua agência já vende.
          <br />
          Evoluímos com a experiência da sua operação.
        </div>
      </Column>
    </Frame>
  );
};

// 12. Chamada final com contato comercial.
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useReveal(2);
  const bar = interpolate(frame, [18, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const b = useReveal(44);
  return (
    <Frame tone="navy" eyebrow="Vamos construir essa parceria" accentBar>
      <Column center gap={56}>
        <div style={{...a, ...H1, color: colors.white}}>Vamos testar com o que sua agência já vende.</div>
        <div style={{overflow: 'hidden', width: 1180}}>
          <div
            style={{
              background: colors.red,
              color: colors.white,
              fontSize: 52,
              fontWeight: 800,
              padding: '30px 44px',
              transform: `translateX(${(bar - 1) * 100}%)`,
            }}
          >
            Vamos cotar as suas próximas viagens.
          </div>
        </div>
        <div style={{...b, display: 'flex', flexDirection: 'column', gap: 16}}>
          <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: colors.cyan}}>
            Contato comercial
          </div>
          <div style={{display: 'flex', gap: 80, alignItems: 'baseline'}}>
            <div style={{fontSize: 44, fontWeight: 700, color: colors.white}}>Thiago Junqueira</div>
            <div style={{fontSize: 44, color: colors.white}}>+55 31 98473-3915</div>
            <div style={{fontSize: 44, color: colors.cyan}}>www.voepontos.com.br</div>
          </div>
        </div>
      </Column>
    </Frame>
  );
};
