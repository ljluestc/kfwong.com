hexo.on('generateAfter', function () {
	const { exec } = require('child_process');

	exec('mkdir public/', (err, stdout) => err ? console.log(err) : console.log(stdout));

	exec('cp _redirects public/', (err, stdout, stderr) => {
		console.log("[netlify-redirection-rules] Executing...")
		if (err) {
			console.log("[netlify-redirection-rules] Failed!")
			console.error(err)
			return
		}
		console.log("[netlify-redirection-rules] Success!")
	})
})