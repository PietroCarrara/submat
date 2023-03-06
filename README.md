# submat

## Documentação

Esse projeto é feito em [VueJS](https://vuejs.org/guide/introduction.html), um framework que facilita o desenvolvimento de interfaces com Javascript e HTML. Ele é bem modular, e divide as partes da interface em **componentes**. Pense neles como classes de orientação a objetos: eles possuem tanto uma descrição da parte visual quando o código que altera ela. Leia a documentação deles e veja os componentes que já temos implementados em [src/components/](src/components/)

Quando um componente precisa comunicar dados para outro, em VueJS isso é feito através de um **Store**. Para isso usamos a biblioteca [Pinia](https://pinia.vuejs.org/introduction.html). Leia a documentação deles e veja os stores que já temos implementados em [src/stores/](src/stores/).

A tela que "gruda" todos os componentes juntos é a [App.vue](src/App.vue).

## IDE Recomendada

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

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