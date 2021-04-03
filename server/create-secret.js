const path = require("path")
const child_process = require("child_process")
const fs = require("fs")

const keyGen = path.join(__dirname, "./node_modules/.bin/secure-session-gen-key")
child_process.exec(keyGen, {}, (error, stdout) => {
  const buffer = Buffer.from(stdout, 'utf-8')

  console.log("Place this inside your .env file:")
  console.log()
  console.log(`SESSION_KEY=${buffer.toString("hex")}`)
  console.log()
})

