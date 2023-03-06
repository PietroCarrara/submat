# submat

## Documentação

Esse projeto é feito em [VueJS](https://vuejs.org/guide/introduction.html), um framework que facilita o desenvolvimento de interfaces com Javascript e HTML. Ele é bem modular, e divide as partes da interface em **componentes**. Pense neles como classes de orientação a objetos: eles possuem tanto uma descrição da parte visual quando o código que altera ela. Leia a documentação deles e veja os componentes que já temos implementados em [src/components/](src/components/)

Quando um componente precisa comunicar dados para outro, em VueJS isso é feito através de um **Store**. Para isso usamos a biblioteca [Pinia](https://pinia.vuejs.org/introduction.html). Leia a documentação deles e veja os stores que já temos implementados em [src/stores/](src/stores/).

A tela que "gruda" todos os componentes juntos é a [MainComponent.vue](src/components/MainComponent.vue).

Pra CSS, estamos usando o framework [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/). Ele é bem completo, e uma das coisas mais legais de aprender é o [sistema de grid](https://getbootstrap.com/docs/5.3/layout/grid/).

Para scripting, estamos usando Typescript (basicamente, Javascript mas com tipos). É bem parecido com C\#, Java e Javascript. Se os tipos estiverem enchendo muito o saco em algum momento, é só dizer que a sua variável é do tipo `any` (claro, o código fica menos legível e o editor para de completar sozinho, mas não esquenta a cabeça).

## IDE Recomendada

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

Se você já instalou o Vetur no passado, desinstale-o de seu VSCode: ele conflita com o Volar e só serve para o Vue2, mas estamos usando Vue3.

## Rodando o Projeto

Rode o comando abaixo após ter clonado este repositório, ele instalará as bibliotecas requeridas:

```sh
npm install
```

Depois, quando quiser rodar o projeto em sua máquina, execute o seguinte:

```sh
npm run dev
```

Ele compila o projeto e o abre em seu browser padrão. O comando também observa mudanças nos arquivos fonte, então não é necessário recarregar o browser ou re-rodar esse comando quando mudar o código.

Pra fechar ele, é só apertar "q" no terminal, ou Ctrl+C.

## O Que Devo Programar?

Veja as [issues](https://github.com/PietroCarrara/submat/issues) que ainda não foram pegas por outros membros da equipe: elas contém explicações breves sobre o que deve ser feito em cada parte do sistema.

## Estou batendo a cabeça na tela, não consigo entender isso!

Relaxa e chama o pae no zap.
