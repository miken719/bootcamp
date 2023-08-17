const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

exports.tweet = async () => {
  const BEARER_TOKEN = process.env.ACCESS_TOKEN; // Use the correct environment variable
  const endpointUrl = "https://api.twitter.com/2/tweets";
  const tweetContent = "Hello, Twitter API v2!";
  console.log(BEARER_TOKEN, "BEARER_TOKEN");
  try {
    const response = await axios.post(
      endpointUrl,
      { text: tweetContent },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (response.status === 201) {
      console.log("Tweet posted successfully:", response.data.text);
    } else {
      console.error("Error posting tweet:", response.data);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};
