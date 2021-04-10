// see more: https://www.mailhardener.com/kb/how-to-create-a-dkim-record-with-openssl
// note: use openssl commands outside of powershell(core) as the encoding is different

const child_process = require('child_process');

function generatePrivateKey() {
  return new Promise((resolve, reject) => {
    child_process.exec('openssl genrsa 2048', (error, stdout) => {
      if (error !== null) {
        console.log(error.message);
        reject();
      }

      resolve(Buffer.from(stdout, 'utf-8'));
    });
  });
}

function generatePublicKey(privateKey) {
  return new Promise((resolve, reject) => {
    const proc = child_process.exec('openssl rsa -pubout -outform DER | openssl base64 -A', (error, stdout) => {
      if (error !== null) {
        console.log(error.message);
        reject();
      }

      resolve(Buffer.from(stdout, 'base64'));
    });

    proc.stdin.write(privateKey);
    proc.stdin.end();
  });
}

async function generate() {
  const privateKey = await generatePrivateKey();
  console.log('Generated private key:');
  console.log('');
  console.log(`MAIL_DKIM_PRIVATE_KEY=${privateKey.toString('base64')}`);
  console.log('');

  const publicKey = await generatePublicKey(privateKey);
  console.log('Generated DNS record:');
  console.log('');
  console.log(`v=DKIM1; p=${publicKey.toString('base64')}`);
  console.log('');
}

generate().catch((error) => console.log(error));
