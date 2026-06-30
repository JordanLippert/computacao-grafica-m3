# Boids — Modelo Comportamental Distribuído para Movimento Agregado

Simulação interativa do modelo de **Boids** de Craig W. Reynolds (*Flocks, Herds, and
Schools: A Distributed Behavioral Model*, SIGGRAPH '87), implementada em **React +
TypeScript + Vite** com renderização em **Canvas 2D**.

Trabalho da disciplina de Computação Gráfica — Tópicos Especiais (M3), Curso de Ciência da
Computação da Escola Politécnica da UNIVALI.

**Autores:** André Gabriel Melo, Caio Furtado Rosa, Jordan Lippert de Oliveira,
Lucas Bittencourt Rauch.

## Sobre

Cada *boid* é um agente autônomo que decide seu rumo apenas pela percepção local, a partir de
três regras de direção. O padrão global do bando emerge da interação dessas regras simples —
sem controle central nem trajetórias roteirizadas (comportamento emergente).

Padrão de direção de Reynolds: para cada comportamento calcula-se a velocidade desejada,
subtrai-se a velocidade atual e limita-se o resultado pela força máxima.

## Funcionalidades

- **Três regras** — separação, alinhamento e coesão, com pesos ajustáveis ao vivo.
- **Percepção local** por raio configurável + ângulo de visão (FOV); a separação atua em raio
  menor (curto alcance).
- **Fuga do predador** — o cursor age como predador e os boids fogem dele.
- **Grade de hash espacial** para busca de vizinhos (O(n²) → ~O(n)), permitindo centenas de
  boids em tempo real.
- **Sonda de percepção** (didático) — destaca um boid e desenha seu raio, as ligações aos
  vizinhos e os três vetores de direção em cores distintas.
- **Cenários pré-definidos** — "só separação", "só alinhamento", "só coesão" e "equilibrado".
- **Mundo toroidal** — as bordas se conectam; distâncias coerentes com o fechamento.
- **HUD** — número de boids, FPS e média de vizinhos por boid.
- **Visual** — rastro de movimento, brilho e coloração dos boids por velocidade.

## Arquitetura

O React gerencia apenas a interface (controles e HUD). A simulação e a renderização rodam em
código imperativo num laço `requestAnimationFrame`, preservando 60 FPS com centenas de boids.

```
src/
  sim/      vetores, distância toroidal, Boid, grade espacial, regras, Simulação
  render/   Renderer (Canvas 2D: boids, rastros, sonda)
  hooks/    useSimulation (laço de animação, redimensionamento, predador)
  ui/       Controls, Hud (React + Tailwind)
```

## Como rodar

Requisitos: [Bun](https://bun.sh) e [pnpm](https://pnpm.io).

```bash
pnpm install        # instala dependências
pnpm dev            # servidor de desenvolvimento (http://localhost:5173)
pnpm build          # build de produção
pnpm test           # testes das funções puras (bun test)
```

## Testes

As funções puras (operações de vetor, distância toroidal e as três regras) têm testes
automatizados via `bun test`:

```bash
bun test src/sim
```

## Referências

- REYNOLDS, C. W. *Flocks, Herds, and Schools: A Distributed Behavioral Model.* ACM SIGGRAPH
  Computer Graphics, v. 21, n. 4, p. 25–34, 1987. DOI: 10.1145/37402.37406.
- REYNOLDS, C. W. *Steering Behaviors For Autonomous Characters.* GDC, 1999.
