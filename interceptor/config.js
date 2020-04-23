module.exports = {
    PORT: process.env.PORT || 5000,
    sapID : "ID",
    sapPASSWORD : "password",
    options :{
      url : "http://server07.tcsj-entsol.local:8001/sap/opu/odata/sap/ZSRV_SOCHATBOT_SRV/",
      auth: {
        username: '1736424',
        password: 'Arun@123'
    },
        headers: {
          'Authorization': 'Basic ', 
          'Content-Type': 'application/json',
          "accept": "application/json",
          'X-CSRF-Token': 'Fetch' // get CSRF Token for post or update
                 }
            }
};