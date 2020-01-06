#!/usr/bin/env node

import { TodoDefaultPresenter, TodoInMemoryRepository, TodoPresenter } from '@domisoft/todo-clean-architecture';
import chalk from 'chalk';
import clear from 'clear';
import program from 'commander';
import figlet from 'figlet';

(async () => {
  const todoApp: TodoPresenter = new TodoDefaultPresenter(new TodoInMemoryRepository([
    { id: '1', title: 'foo', completed: false }
  ]));

  // const todos = await Promise.resolve('5'); //todoApp.todos$.toPromise();
  // const todos = await todoApp.todos$.toPromise();
  todoApp.todos$.subscribe(todos => {
    console.log('t', todos);
  });

  todoApp.getAllTodos();
  // clear();


  // console.log(
  //   chalk.blue(
  //     figlet.textSync(todos.toString(), { horizontalLayout: 'full' })
  //   )
  // );

  console.log(
    chalk.red(
      figlet.textSync('Todo CLI', { horizontalLayout: 'full' })
    )
  );

  program
    .version('0.0.1')
    .description('An example CLI for ordering pizza\'s')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
    .option('-C, --no-cheese', 'You do not want any cheese')
    .parse(process.argv);

  console.log('you ordered a pizza with:');

  if (program.peppers) { console.log('  - peppers'); }
  if (program.pineapple) { console.log('  - pineapple'); }
  if (program.bbq) { console.log('  - bbq'); }

  const cheese: string = true === program.cheese
    ? 'marble'
    : program.cheese || 'no';

  console.log('  - %s cheese', cheese);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

})();