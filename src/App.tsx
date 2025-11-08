import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './assets/css/App.css'

function App() {
	const [count, setCount] = useState(0)

	const markdown = `# Hello World!

This is a sample article using Tailwind CSS Typography plugin.

- This is a list item
- Another list item

**Bold Text** and *Italic Text*.
`

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>

			<h1 className="text-sm font-bold">Vite + React</h1>
			<h2 className="text-emerald-100 text-2xl">Some Text</h2>

			<article className="prose dark:prose-invert max-w-none p-6">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>
					{markdown}
				</ReactMarkdown>
			</article>

			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}

export default App
