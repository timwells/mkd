
// Rename config_template.js to config.js
// Add api_keys to array as guuid's
const config = {
    apiKeys: [
        "aaaaaaaa-1111-2222-3333-xxxxxxxxxxxx",
        "bbbbbbbb-1111-2222-3333-yyyyyyyyyyyy",
        "bbbbbbbb-1111-2222-3333-yyyyyyyyyyyy",
    ],
    emailCredentials: {
        service:"yahoo",
        email:"email",
        pwd:"pwd"
    }
}

module.exports = {
    config,
}