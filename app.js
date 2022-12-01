const express = require(`express`);
const bodyParser = require(`body-parser`);
const https = require(`node:https`);

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`public`));

app.get(`/`, function (req, res) {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post(`/`, function (req, res) {
  const userFirstName = req.body.userFirstName;
  const userLastName = req.body.userLastName;
  const userEmail = req.body.userEmail;

  const userData = {
    members: [
      {
        email_address: userEmail,
        status: `subscribed`,
        merge_fields: {
          FNAME: userFirstName,
          LNAME: userLastName,
        },
      },
    ],
  };

  const jsonUserData = JSON.stringify(userData);
  const mailchimpApiURL = `https://us21.api.mailchimp.com/3.0/lists/72c734ca4c`;
  const options = {
    method: `post`,
    auth: `muhammadKhizar:c4d775d03d7973e344684d0221bb3c8a-us21`,
  };

  const request = https.request(mailchimpApiURL, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }
    response.on(`data`, function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonUserData);
  request.end();
});

app.post(`/failure`, function (req, res) {
  res.redirect(`/`);
});

app.listen(port, function () {
  console.log(`Server started listening on port ${port}.`);
});

// apiKey = d68132c86abc07eccf7dc47e792600d9-us21
// audienceID = 72c734ca4c
