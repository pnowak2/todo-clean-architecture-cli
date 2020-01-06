#!/usr/bin/env node

import { TodoDefaultPresenter, TodoInMemoryRepository, TodoPresenter } from '@domisoft/todo-clean-architecture';
import chalk from 'chalk';
import clear from 'clear';
import program from 'commander';
import figlet from 'figlet';
import inquirer from 'inquirer';
import Table from 'cli-table';
import { combineLatest } from 'rxjs';

// inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'operation',
//       message: 'Math Operation?',
//       choices: ['add', 'substract', 'multiply', 'divide']
//     }
//   ])
//   .then(answers => {
//     console.info('Answer:', answers.operation);
//   });


const todoApp: TodoPresenter = new TodoDefaultPresenter(new TodoInMemoryRepository([
  { id: '1', title: 'foo', completed: false },
  { id: '2', title: 'bar', completed: false },
  { id: '3', title: 'baz', completed: true },
]));

combineLatest(todoApp.todos$, todoApp.activeTodosCount$).subscribe(([tso, count]) => {
  clear();

  console.log(
    chalk.red(
      figlet.textSync('Todo CLI', { horizontalLayout: 'full' })
    )
  );

  console.log(
    chalk.yellow(
      figlet.textSync(`${count} active todos`, { horizontalLayout: 'full' })
    )
  );

  const table = new Table({
    head: ['completed', 'id', 'name']
  });
  tso.forEach(it => {
    table.push([it.completed ? '[x]' : '[ ]', it.id, it.name])
  })
  console.log(table.toString());
});

todoApp.getActiveTodos();
todoApp.getCompletedTodos();
todoApp.getAllTodos();
// todoApp.markTodoAsActive('3');
// todoApp.addTodo('a');
// todoApp.addTodo('b');

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
