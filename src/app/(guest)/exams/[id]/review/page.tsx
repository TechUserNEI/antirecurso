'use client';

import React, { useContext, useEffect } from 'react';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import CommentSection from '@/components/CommentSection';
import ExamNumeration from '@/components/ExamNumeration';
import ExamNumerationContainer from '@/components/ExamNumerationContainer';
import PrimaryButton from '@/components/PrimaryButton';
import QuestionReview from '@/components/QuestionReview';
import { ExamContext } from 'src/contexts/ExamContext';
import useExamReviewNavigation from 'src/hooks/useExamReviewNavigation';
import { BASE_URL } from 'src/services/api';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const reviewPage: React.FC<ExamPageProps> = ({ params }) => {
  const { subject } = useContext(ExamContext);

  const { currentQuestionIndex, currentQuestion, changeQuestion, setExamResult, examResult } =
    useExamReviewNavigation();

  function getFirstWrongQuestionIndex() {
    if (!examResult) return;

    const wrongAnswer = examResult.questions.find(
      (question: { is_wrong: boolean }) => question.is_wrong
    );
    if (!wrongAnswer) return;

    return examResult.questions.indexOf(wrongAnswer);
  }

  async function getExamResult() {
    const res = await fetch(`${BASE_URL}/exams/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-cache' // TODO analyze if we can use hydration
    });

    setExamResult(await res.json());
  }

  useEffect(() => {
    getExamResult();
  }, []);

  useEffect(() => {
    const index = getFirstWrongQuestionIndex();
    if (index) changeQuestion(index);
  }, [examResult]);

  const N_SKELETON_QUESTIONS = 10;
  const N_SKELETON_OPTIONS = 4;

  return (
    <section className="h-[90vh] flex flex-col items-center">
      <p className="text-xl font-bold uppercase mt-10 ml-5">
        Exame de <span className="text-primary">{subject}</span>
      </p>
      <div className="mb-12">
        {examResult ? (
          <ExamNumerationContainer>
            <PrimaryButton
              className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center mr-4 ${
                currentQuestionIndex === 0 ? 'opacity-50' : ''
              }`}
              onClick={() => changeQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}>
              {'<'}
            </PrimaryButton>
            {examResult.questions.map((question, i) => (
              <ExamNumeration
                key={i}
                onClick={() => changeQuestion(i)}
                isWrong={question.is_wrong}
                active={currentQuestionIndex === i}>
                {i + 1}
              </ExamNumeration>
            ))}
            <PrimaryButton
              className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center ${
                currentQuestionIndex === examResult.questions.length - 1 ? 'opacity-50' : ''
              }`}
              onClick={() => changeQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === examResult.questions.length - 1}>
              {'>'}
            </PrimaryButton>
          </ExamNumerationContainer>
        ) : (
          <div className="w-screen flex  items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
            {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-10 p-5 flex items-center justify-center "
                circle={true}
              />
            ))}
          </div>
        )}
        <section className="mt-5 px-5 md:px-32">
          <div className="relative w-full h-48">
            <Image
              fill
              alt="Subject"
              className="object-cover h-full w-full"
              src="/images/prcmp.jpg"
            />
          </div>

          {currentQuestion?.question ? (
            <QuestionReview currentQuestion={currentQuestion} />
          ) : (
            <div className="mt-12">
              <Skeleton className="h-20 mt-6" count={N_SKELETON_OPTIONS} />
            </div>
          )}
        </section>

        <CommentSection
          comments={examResult?.questions[currentQuestionIndex]?.comments}
          questionId={currentQuestion?.question.id}
        />
      </div>
    </section>
  );
};

export default reviewPage;
