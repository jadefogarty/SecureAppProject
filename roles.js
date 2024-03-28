const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("user")
 .readOwn("review")
 .updateOwn("review")
 .readAny("review")
 .updateAny("review")
 .readOwn("user")


ac.grant("admin")
 .extend("user")
 .deleteAny("review")
 .readOwn("user")
 .updateOwn("user")
 .readAny("user")
 .updateAny("user")
 .deleteAny("user")
 .readAny("user")

return ac;
})();
