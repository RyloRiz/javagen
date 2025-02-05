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

function javaGen(subclass: string, superclass: string = "", members: Member[] = []): string {
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
			<br/>
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
			<button onClick={() => {
				const subclass = document.getElementById("subclass") as HTMLInputElement;
				const superclass = document.getElementById("superclass") as HTMLInputElement;
				const members: Member[] = [];

				for (let i = 0; i < 5; i++) {
					const n = document.getElementById(`name-${i}`) as HTMLInputElement;
					const t = document.getElementById(`type-${i}`) as HTMLInputElement;
					const g = document.getElementById(`get-${i}`) as HTMLInputElement;
					const s = document.getElementById(`set-${i}`) as HTMLInputElement;
					if (n.value.length > 0 && t.value.length > 0) {
						members.push({ name: n.value, type: t.value, get: g.checked, set: s.checked });
					}
				}

				setJavaCode(javaGen(subclass.value, superclass.value, members));
			}}>Generate</button>
			<br/>
			<br/>
			<textarea name="" id="" cols={50} rows={20} value={javaCode}></textarea>
		</>
	);
}

export default App;
