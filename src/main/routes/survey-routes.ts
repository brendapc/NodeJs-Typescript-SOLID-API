import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { adaptMiddleware } from "./../adapters/express/express-middleware-adapter";
import { makeAuthMiddleware } from "./../factories/middlewares/auth-middleware-factory";
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";
import { makeLoadSurveysController } from "../factories/controllers/survey/load-surveys/make-load-surveys-controller";

export default (router: Router): void => {
  const adminRoute = adaptMiddleware(makeAuthMiddleware("admin"));
  const auth = adaptMiddleware(makeAuthMiddleware());

  router.post("/surveys", adminRoute, adaptRoute(makeAddSurveyController()));
  router.get("/surveys", auth, adaptRoute(makeLoadSurveysController()));
};
