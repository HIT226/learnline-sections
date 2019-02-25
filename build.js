const fs = require('fs');
const glob = require('glob');
const marked = require('marked');
const pug = require('pug');


function updateSection(section) {
	if(section.tasks) {
		const tasks = section.tasks.map((task) => {
			if(typeof task === 'object') {
				const subtasks = task.subtasks.map((subtask) => marked(subtask));
				return Object.assign({}, task, {subtasks});
			}
			return marked(task);
		});

		console.log(tasks);

		return Object.assign({}, section, {tasks});
	}
}



var target = process.argv[2] || '*';

const matchString = `data/${target}data.json`;
console.log('match', matchString);

glob(matchString , {nocase: true}, (er, files) => {
	if(er) {
		console.error(er);
		return;
	}

	// Load pug template
	var templatePath = require.resolve('./sectiontemplate.pug');
	const template = pug.compileFile(templatePath);

	const dir = './build';
	if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
	}

	files.forEach((file) => {
		const data = require(`./${file}`);
		const sections = data.sections.map((section) => updateSection(section));
		const html = template({sections});

		console.log('html', html);

		fs.writeFileSync(`${dir}/${target}.html`, html);

	});
});


