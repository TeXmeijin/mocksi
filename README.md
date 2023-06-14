## 概要

- ディレクトリを指定して実行すると、ディレクトリ内に含まれるTypeScriptファイルの型情報からモックデータを生成する関数を自動生成する

## 課題

- テストコード上やStorybookなどでモックデータを生成する関数を実装するのが面倒
- 初期実装からきちんと継続していると苦ではないが途中からモックデータを生成するように運用するのは至難の業
- TypeScriptのASTから型情報を読み取って、faker等と組み合わせてモックデータ自動生成ができるのではないか
- モックデータ生成用関数を自動生成する思想にする。その関数の利用者はPartialな型のオブジェクトを入れられて、内部的にマージされてReturnされる。これによりテストコードでの汎用性が高まる
- 最終的には、npm run dev時にwatchを走らせて絶えず指定ディレクトリの型定義ファイルからモックデータ生成関数が生成されるようにしたい。利用者側はnpm-run-allのようなテクノロジーで起動しておくイメージ

## 現時点の実行例（最終形ではない）
```shell
npx ts-node main.ts -d ./src/hoge/types.ts
```

生成物は以下の通り
```ts
import { faker } from '@faker-js/faker';
import { Hoge } from './types';

export const createMockHoge = (data: Partial<Hoge>) => {
  return {
    id: faker.random.number(),
    name: faker.random.word(),
    slug: faker.random.word(),
    ...data
  }
}
```

課題点は多くあり、たとえば以下の通り
- fakerへの依存は必須なのか（peer扱いにするか）
- fakerのランダム生成関数は型ごとに固定か（zodObjectだったらより詳細にするなど？）
- 生成場所は一旦同ディレクトリ内にしているが、それはOptionにしたほうがいいのか

## 注意点メモ

- Node20あたりからディレクトリへのアクセスがよりSafetyになっているので注意する
