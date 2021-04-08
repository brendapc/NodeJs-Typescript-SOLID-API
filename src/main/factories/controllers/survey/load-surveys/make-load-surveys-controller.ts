import { makeDbLoadSurveys } from './../../../usecases/survey/load-surveys/db-load-surveys';
import { makeLogControllerDecorator } from './../../../decorators/log-controller-decorator-factory';
import { LoadSurveysController } from './../../../../../presentation/controllers/login/survey/load-survey/load-survey-controller';
import { Controller } from './../../../../../presentation/protocols/controller';
export const makeLoadSurveysController = (): Controller => {
    const controller = new LoadSurveysController(makeDbLoadSurveys())
    return makeLogControllerDecorator(controller)
}