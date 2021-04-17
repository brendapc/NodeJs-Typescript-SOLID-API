import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { adaptMiddleware } from "../adapters/express/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";
import { makeSaveSurveyResultController } from "../factories/controllers/survey/load-surveys/load-surveys-controller-factory";

export default (router: Router): void => {
  const adminRoute = adaptMiddleware(makeAuthMiddleware("admin"));
  const auth = adaptMiddleware(makeAuthMiddleware());

  router.put(
    "/surveys/:surveyId/results",
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
};
