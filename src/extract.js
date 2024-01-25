import fs from 'fs';

const extractData = () => {
  const followers = [];
  fs.readFile('./data/instaData.har', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const entries = jsonData.log.entries;
      const validEntries = entries.filter(entry => {
        if (entry.request.url.includes('/followers/')) {
          console.log(entry.request.url);
          return true;
        }
        return false;
      });
      const contents = validEntries.map(entry => entry.response.content);

      for (const content of contents) {
        if (content.text) {
          try {
            const text = JSON.parse(content.text);
            text.users.forEach(user => {
              followers.push({
                username: user.username,
                full_name: user.full_name,
                id: user.pk,
              });
            });
          } catch (e) {
            console.log(content.text);
            const text = Buffer.from(content.text, 'base64').toString('utf-8');
            JSON.parse(text).users.forEach(user => {
              followers.push({
                username: user.username,
                full_name: user.full_name,
                id: user.pk,
              });
            });
          }
        }
      }
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
    }
    console.table(followers);
    console.log(JSON.stringify(followers));
    fs.writeFile('./data/followers.json', JSON.stringify(followers), err => {
      if (err) {
        console.error(err);
      }
    });
  });
};
extractData();
