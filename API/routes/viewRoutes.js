const { authJwt } = require("../middlewares")
const controller = require("../controllers/viewControllers");
const { canFillReport } = require("../middlewares/authJwt");

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
      
      app.post(
          "/api/view/assign",
          [authJwt.verifyToken, authJwt.isAdmin, authJwt.uniqueUser],
          controller.assignDoctor
      )

      app.get(
        "/api/view/:userId",
        [authJwt.verifyToken, authJwt.canView],
        controller.profileInfo
      )

      app.get(
        "/api/view/",
        [authJwt.verifyToken, requestRoleName],
        controller.viewAll
      )
        
      app.put(
        "/api/view/requestReport",
        [authJwt.verifyToken, authJwt.isDoctor, authJwt.isMyPatient, authJwt.dailyReport],
        controller.askReport
      )

      app.put(
        "/api/view/fillReport",
        [authJwt.verifyToken, authJwt.canFillReport],
        controller.fillReport
      )
      
      app.get(
        "/api/view/:userId/report",
        [authJwt.verifyToken, authJwt.isDoctor, authJwt.isMyPatient],
        controller.viewReport
      )

      
}