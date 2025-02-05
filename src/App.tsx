import { useState } from 'react';
import './App.css';

interface Member {
	name: string;
	type: string;
	get: boolean;
	set: boolean;
}

function pascalCase(input: string) {
	return input.charAt(0).toUpperCase() + input.slice(1);
}

function javaGen(subclass: string, superclass: string = "", construct: boolean = false, members: Member[] = [], smembers: Member[] = []): string {
	console.log(members);
	console.log(smembers);

	let code = `public class ${subclass}`;

	if (superclass.length > 0) {
		code += ` extends ${superclass}`;
	}

	code += `\n{\n`;

	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		code += `\tprivate ${member.type} ${(member.name)};\n`;
	}

	code += '\n';

	if (construct) {
		/*
		public Human(boolean alive, String name, int age)
		{
			super(alive);
			this.name = name;
			this.age = age;
		}
		*/
		code += `\tpublic ${subclass}(`;

		const concat = smembers.concat(members);
		for (let i = 0; i < concat.length; i++) {
			const member = concat[i];
			if (i > 0) code += `, `;
			code += `${member.type} ${(member.name)}`;
		}
		code += `)\n\t{\n`;

		if (smembers.length > 0) {
			code += `\t\tsuper(${smembers.map(s => s.name).join(', ')});\n`;
		}

		for (let i = 0; i < members.length; i++) {
			const member = members[i];
			code += `\t\tthis.${member.name} = ${member.name};\n`;
		}

		code += '\t}\n';

		code += `\n`;
	}

	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		if (member.get) {
			code += `\tpublic ${member.type} get${pascalCase(member.name)}()\n\t{\n`;
			code += `\t\treturn ${member.name};\n`;
			code += `\t}\n`;
		}
		if (member.get && member.set) {
			code += `\n`;
		}
		if (member.set) {
			code += `\tpublic void set${pascalCase(member.name)}(${member.type} n)\n\t{\n`;
			code += `\t\t${member.name} = n;\n`;
			code += `\t}\n`;
		}
		if (i < members.length - 1) {
			code += `\n`;
		}
	}

	code += '}\n';

	return code;
}

function App() {
	const [javaCode, setJavaCode] = useState('');

	return (
		<>
			<h1>JavaGen</h1>
			<h3>Generate primitve Java classes for CodeHS assignments</h3>
			<br/>
			<hr/>
			<br/>
			<input type="text" name={`subclass`} id={`subclass`}/>
			<label htmlFor="subclass">Subclass</label>
			<input type="text" name={`superclass`} id={`superclass`}/>
			<label htmlFor="superclass">Superclass</label>
			<input type="checkbox" name={`constructor`} id={`constructor`}/>
			<label htmlFor="constructor">Constructor?</label>
			<br/>
			<br/>
			<button onClick={() => {
				const subclass = document.getElementById("subclass") as HTMLInputElement;
				const superclass = document.getElementById("superclass") as HTMLInputElement;

				superclass.value = subclass.value;
				subclass.value = '';

				for (let i = 0; i < 5; i++) {
					const smemberName = document.getElementById(`s-name-${i}`) as HTMLInputElement;
					console.log(`i=${i} with ${smemberName.value} of length ${smemberName.value.length}`);
					if (smemberName.value.length > 0) continue;
					// 2 1
					console.log("Starting on i=" + i);
					for (let j = 0; j < 5-i; j++) {
						const memberName = document.getElementById(`name-${j}`) as HTMLInputElement;
						const memberType = document.getElementById(`type-${j}`) as HTMLInputElement;
						const smemberName = document.getElementById(`s-name-${i+j}`) as HTMLInputElement;
						const smemberType = document.getElementById(`s-type-${i+j}`) as HTMLInputElement;
						const memberGet = document.getElementById(`get-${j}`) as HTMLInputElement;
						const memberSet = document.getElementById(`set-${j}`) as HTMLInputElement;

						smemberName.value = memberName.value;
						smemberType.value = memberType.value;
						memberName.value = '';
						memberType.value = '';

						memberGet.checked = true;
						memberSet.checked = true;
					}

					break;
				}
			}}>Next Subclass</button>
			<br/>
			<h4>Explicit Attributes</h4>
			<div>
				{Array(5).fill(null).map((_, idx: number) =>
					<div className="hstack" key={idx}>
						<input type="text" id={`name-${idx}`}/>
						<input type="text" id={`type-${idx}`}/>
						<input type="checkbox" id={`get-${idx}`} defaultChecked={true}/>
						<input type="checkbox" id={`set-${idx}`} defaultChecked={true}/>
					</div>
				)}
			</div>
			<br/>
			<br/>
			<h4>Inherited Attributes</h4>
			<div>
				{Array(5).fill(null).map((_, idx: number) =>
					<div className="hstack" key={idx}>
						<input type="text" id={`s-name-${idx}`}/>
						<input type="text" id={`s-type-${idx}`}/>
					</div>
				)}
			</div>
			<br/>
			<button onClick={() => {
				const subclass = document.getElementById("subclass") as HTMLInputElement;
				const superclass = document.getElementById("superclass") as HTMLInputElement;
				const constructor = document.getElementById("constructor") as HTMLInputElement;
				const members: Member[] = [];
				const smembers: Member[] = [];

				for (let i = 0; i < 5; i++) {
					const n = document.getElementById(`name-${i}`) as HTMLInputElement;
					const t = document.getElementById(`type-${i}`) as HTMLInputElement;
					const g = document.getElementById(`get-${i}`) as HTMLInputElement;
					const s = document.getElementById(`set-${i}`) as HTMLInputElement;
					if (n.value.length > 0 && t.value.length > 0) {
						members.push({ name: n.value, type: t.value, get: g.checked, set: s.checked });
					}
				}

				for (let i = 0; i < 5; i++) {
					const n = document.getElementById(`s-name-${i}`) as HTMLInputElement;
					const t = document.getElementById(`s-type-${i}`) as HTMLInputElement;
					if (n.value.length > 0 && t.value.length > 0) {
						smembers.push({ name: n.value, type: t.value, get: false, set: false });
					}
				}

				setJavaCode(javaGen(subclass.value, superclass.value, constructor.checked, members, smembers));
			}}>Generate
			</button>
			<br/>
			<br/>
			<textarea name="" id="" cols={50} rows={20} value={javaCode}></textarea>
		</>
	);
}

export default App;
