import { SurveysModel, ILoadSurveys } from "./load-survey-controller-protocols";
import MockDate from "mockdate";
import { LoadSurveysController } from "./load-survey-controller";
import { ok } from "../../../../helpers/http/http-helper";

const makeFakeSurveys = (): SurveysModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    },
    {
      id: "other_id",
      question: "other_question",
      answers: [
        {
          image: "other_image",
          answer: "other_answer",
        },
      ],
      date: new Date(),
    },
  ];
};

const makeLoadSurveyStub = () => {
  class LoadSurveyStub implements ILoadSurveys {
    async load(): Promise<SurveysModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveyStub();
};

const makeSut = () => {
  const loadSurveysStub = makeLoadSurveyStub();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};

describe("LoadSurvey Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("should call loadSurvey", async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSurveySpy = jest.spyOn(loadSurveysStub, "load");
    await sut.handle({});
    expect(loadSurveySpy).toHaveBeenCalled();
  });

  test("should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });
});
