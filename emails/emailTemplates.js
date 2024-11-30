
export function createWelcomEmailTemplate(name, profileUrl) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <div>
                <h1> Welcom ${name} to Linkedin Colne API</h1>
                <button>${profileUrl}</button>
            </div>
        </body>
        </html>
        `
}

