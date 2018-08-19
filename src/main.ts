import { Command, Helper, OptionsHelper } from '@dojo/cli/interfaces';
import * as webpack from 'webpack';
import { BuildArgs } from './interfaces';
import getConfig from './webpack.config';

import * as rimraf from 'rimraf';
import { copy } from 'cpx';
import * as ts from 'typescript';

function buildTypescript(name: string) {
	const program = ts.createProgram([`${name}/index.ts`], {
		declaration: true,
		module: ts.ModuleKind.CommonJS,
		downlevelIteration: true,
		outDir: `dist/${name}`,
		strict: true,
		target: ts.ScriptTarget.ES5
	});
	return program.emit();
}

const command: Command = {
	group: 'build',
	name: 'theme',
	description: 'create a distributable build of your Dojo theme',
	register(options: OptionsHelper) {
		options('name', {
			describe: 'The name of the theme. Used to set the filename of custom element-compatible builds.',
			alias: 'n'
		});

		options('release', {
			describe: 'The version to use when generating custom element-compatible builds. Defaults to the package.json version.',
			alias: 'r'
		});
	},
	run(helper: Helper, args: BuildArgs) {
		const { name } = args;
		const createTask = (callback: any) => new Promise((resolve, reject) => {
			callback((error?: Error) => {
				if (error) {
					reject(error);
				}
				resolve();
			});
		});

		return createTask((callback: any) => rimraf(`dist/${name}`, callback))
			.then(() => buildTypescript(name))
			.then(() => createTask((callback: any) => copy(`${name}/*.{d.ts,css}`, `dist/${name}`, callback)))
			.then(() => createTask((callback: any) => {
				const compiler = webpack(getConfig(args));
				compiler.run(callback);
			}));
	}
};

export default command;

