import { Command, Helper, OptionsHelper } from '@dojo/cli/interfaces';
import { copy } from 'cpx';
import * as ora from 'ora';
import * as rimraf from 'rimraf';
import * as ts from 'typescript';
import * as webpack from 'webpack';
import { BuildArgs } from './interfaces';
import getConfig from './webpack.config';

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
		const createTask = (callback: any) => new Promise((resolve, reject) => {
			callback((error?: Error) => {
				if (error) {
					reject(error);
				}
				resolve();
			});
		});

		const { name } = args;
		const spinner = ora(`building ${name} theme`).start();
		return createTask((callback: any) => rimraf(`dist/${name}`, callback))
			.then(() => buildTypescript(name))
			.then(() => createTask((callback: any) => copy(`src/${name}/*.{d.ts,css}`, `dist/${name}`, callback)))
			.then(() => createTask((callback: any) => {
				const compiler = webpack(getConfig(args));
				compiler.run(callback);
			}))
			.then(() => {
				spinner.succeed('build successful');
			}, (error) => {
				spinner.fail(error);
			});
	}
};

export default command;

