#!/usr/bin/env node

import { TodoDefaultPresenter, TodoInMemoryRepository, TodoPresenter } from '@domisoft/todo-clean-architecture';
import chalk from 'chalk';
import clear from 'clear';
import Table from 'cli-table';
import program from 'commander';
import figlet from 'figlet';
import { combineLatest } from 'rxjs';
import { skip } from 'rxjs/operators';

const todoApp: TodoPresenter = new TodoDefaultPresenter(new TodoInMemoryRepository([
  { id: '1', title: 'foo', completed: false },
  { id: '2', title: 'bar', completed: false },
  { id: '3', title: 'baz', completed: true },
]));

combineLatest(todoApp.todos$, todoApp.activeTodosCount$)
  .pipe(skip(1))
  .subscribe(([tso, count]) => {
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

todoApp.getAllTodos();

program
  .version('0.0.1')
  .description('Todo CLI')
  .option('-a, --all', 'Show ALL todos')
  .parse(process.argv);

console.log('You selected todos with options');

if (program.all) { console.log('  - all'); }

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
