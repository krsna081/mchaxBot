const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const config = require('../settings.js');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const contactInfo = `${chalk.blue.bold('WhatsApp : 6281235807940')}
${chalk.blue.bold('Instagram : @krsna_081')}`;

async function getUserIPData() {
  try {
    let response = await axios.get("https://raw.githubusercontent.com/krsna081/data-mchax/main/key.json");
    let data = response.data;

    if (!Array.isArray(data)) {
      data = [data];
    }

    let formattedData = data.map(item => {
      if (item && item.user && item.pw && item.owner) {
        return {
          user: item.user,
          pw: item.pw,
          owner: item.owner
        };
      } else {
        return {};
      }
    });

    return formattedData;
  } catch (error) {
    console.error(chalk.red('Terjadi kesalahan saat mengambil data IP: '), error);
    throw error;
  }
}

async function askCredentials(userIPData) {
  return new Promise((resolve) => {
    console.log(chalk.blue.bold("( Question ) Silahkan masukkan username Anda"));
    rl.question(chalk.white("– Username: "), async (usernameInput) => {
      usernameInput = usernameInput.trim()

      let userFound = userIPData.find(user => user.user === usernameInput);

      console.log(chalk.blue.bold("( Question ) Silahkan masukkan password Anda"));
      rl.question(chalk.white("– Password: "), async (passwordInput) => {
        passwordInput = passwordInput.trim();

        const loadingChars = ['×', '=', '×', '='];
        let i = 0;
        const loadingInterval = setInterval(() => {
          process.stdout.write(`\r(${chalk.yellow.bold(loadingChars[i++ % loadingChars.length])}) ${chalk.yellow.bold('Sedang Memeriksa')}`);
        }, 200);

        await new Promise(resolve => setTimeout(resolve, 2500));

        clearInterval(loadingInterval);
        process.stdout.write('\r');
        if (userFound) {
          if (passwordInput === userFound.pw) {
            console.log(chalk.green.bold(`( Success ) Hallo ${userFound.user}, selamat datang di script mchaxBot!`));
            resolve({ status: true });
          } else {
            console.log(chalk.red.bold("( Danied ) Username benar tetapi password salah"));
            resolve({ status: false });
          }
        } else {
          let passwordExists = userIPData.find(user => user.pw === passwordInput);
          if (passwordExists) {
            console.log(chalk.red.bold("( Danied ) Password benar tetapi username salah"));
          } else {
            console.log(chalk.red.bold("( Danied ) Username dan password salah"));
          }
          resolve({ status: false });
        }
      });
    });
  });
}

async function akses() {
  try {
    const userIPData = await getUserIPData();
    let ipMatch = userIPData.find(user => user.owner === config.owner[0]);

    if (!ipMatch) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`${config.owner[0]} ${chalk.red.bold('tidak ditemukan dalam database!')}`);
      console.log(contactInfo);
      console.log(`( Info ) Silakan verifikasi ulang nomor owner Anda.`);
      return { status: false };
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`${config.owner[0]} ${chalk.green.bold('terdaftar di dalam database')}`);
      const credentialsValid = await askCredentials(userIPData);

      if (!credentialsValid.status) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(contactInfo);
        console.log(`( Info ) Silakan hubungi kami di atas untuk verifikasi data Anda.`);
        return { status: false };
      }
      return { status: true };
    }
  } catch (error) {
    console.error(chalk.red('Kesalahan pada fungsi stabilizer: '), error);
  }
}

module.exports = akses;