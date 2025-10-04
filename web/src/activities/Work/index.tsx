import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { jobs } from '../../utils/jobs'
import { items } from '../../utils/items'
import { getRandomTriviaQuestion, type TriviaQuestion } from '../../utils/triviaQuestions'

interface WorkActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onWorkComplete: () => void
}

export default function WorkActivity({ isOnCooldown, cooldownTime, onCooldownChange, onWorkComplete }: WorkActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(10)

  // Timer effect for questions
  useEffect(() => {
    if (!currentQuestion || selectedAnswer !== null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto-submit with no bonus
          setTimeout(() => handleTimeUp(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, selectedAnswer, timeLeft])

  const handleTimeUp = () => {
    if (!currentQuestion) return

    setIsTransitioning(true)
    notify({
      type: 'info',
      title: 'Time\'s Up!',
      message: 'You didn\'t answer in time. No bonus earned this time.'
    })

    // Still earn base job salary
    const job = jobs[state.currentJobId || '']
    let baseSalary = 0
    if (job && job.payPerWork) {
      // Use a random amount within the job's pay range
      baseSalary = job.payPerWork.min + Math.floor(Math.random() * (job.payPerWork.max - job.payPerWork.min + 1))
      actions.addToWallet(baseSalary)
    }

    actions.trackActivity(`Work: ${state.currentJobId ? (jobs[state.currentJobId]?.name || 'Unknown') : 'Unemployed'}`)

    // Inform outcome
    notify({
      type: 'info',
      title: 'Work Complete',
      message: `You made ${baseSalary} WTC from ${job ? job.name : 'your job'}, but no bonus was awarded.`
    })

    // Start 10s cooldown and return to main UI
    onCooldownChange(true, 10)

    setTimeout(() => {
      onWorkComplete()
      setIsTransitioning(false)
      setCurrentQuestion(null)
      setSelectedAnswer(null)
      setTimeLeft(10)
    }, 100)
  }

  const handleStartWork = () => {
    if (isOnCooldown || isTransitioning) return

    if (!state.currentJobId) {
      notify({ type: 'error', title: 'No job selected', message: 'Open Job in the Utility bar, apply for a job, then try working again.' })
      return
    }

    const job = jobs[state.currentJobId]
    if (!job) {
      notify({ type: 'error', title: 'Invalid job', message: 'Your current job is invalid. Please re-apply.' })
      return
    }

    setIsTransitioning(true)
    const question = getRandomTriviaQuestion()
    setCurrentQuestion(question)
    setSelectedAnswer(null)
    setTimeLeft(10) // Reset timer
    setIsTransitioning(false)
  }

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setIsTransitioning(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    let bonusAmount = 0
    let bonusMessage = ''
    let bonusItems: string[] = []

    if (isCorrect) {
      // Apply bonus based on question type
      switch (currentQuestion.bonus.type) {
        case 'wtc':
          bonusAmount = currentQuestion.bonus.wtc
          actions.addToWallet(bonusAmount)
          bonusMessage = `You earned ${bonusAmount} WTC!`
          break
        case 'item': {
          // Add item to inventory (if defined)
          const itemId = currentQuestion.bonus.itemId
          if (itemId) {
            actions.addItem(itemId)
            bonusItems.push(itemId)
            bonusMessage = `You received ${items[itemId]?.name || 'an item'}!`
          } else {
            bonusMessage = 'You received an item!'
          }
          break
        }
        case 'both': {
          // Both WTC and item
          bonusAmount = currentQuestion.bonus.wtc
          actions.addToWallet(bonusAmount)
          const itemId = currentQuestion.bonus.itemId
          if (itemId) {
            actions.addItem(itemId)
            bonusItems.push(itemId)
            bonusMessage = `You earned ${bonusAmount} WTC and received ${items[itemId]?.name || 'an item'}!`
          } else {
            bonusMessage = `You earned ${bonusAmount} WTC!`
          }
          break
        }
      }

      notify({
        type: 'success',
        title: 'Correct Answer!',
        message: `Great job! ${bonusMessage}`
      })
    } else {
      notify({
        type: 'error',
        title: 'Wrong Answer',
        message: 'Better luck next time!'
      })
    }

    // Always earn base job salary
    const job = jobs[state.currentJobId || '']
    let baseSalary = 0
    if (job && job.payPerWork) {
      // Use a random amount within the job's pay range for more variety
      baseSalary = job.payPerWork.min + Math.floor(Math.random() * (job.payPerWork.max - job.payPerWork.min + 1))
      actions.addToWallet(baseSalary)
    }

    actions.trackActivity(`Work: ${state.currentJobId ? (jobs[state.currentJobId]?.name || 'Unknown') : 'Unemployed'}`)

    // Show outcome notification
    let outcomeMessage = `You made ${baseSalary} WTC from ${job ? job.name : 'your job'}.`
    if (isCorrect) {
      outcomeMessage += ` ${bonusMessage}`
    } else {
      outcomeMessage += ' But you missed the bonus opportunity.'
    }

    notify({
      type: isCorrect ? 'success' : 'error',
      title: isCorrect ? 'Work Complete' : 'Work Complete',
      message: outcomeMessage
    })

    // Start 10s cooldown and return to main UI
    onCooldownChange(true, 10)

    setTimeout(() => {
      onWorkComplete()
      setIsTransitioning(false)
      setCurrentQuestion(null)
      setSelectedAnswer(null)
      setTimeLeft(10)
    }, 100)
  }

  const handleSkip = () => {
    if (!currentQuestion) return

    setIsTransitioning(true)
    notify({
      type: 'info',
      title: 'Question Skipped',
      message: 'No bonus earned this time.'
    })

    // Still earn base job salary even when skipping
    const job = jobs[state.currentJobId || '']
    let baseSalary = 0
    if (job && job.payPerWork) {
      // Use a random amount within the job's pay range
      baseSalary = job.payPerWork.min + Math.floor(Math.random() * (job.payPerWork.max - job.payPerWork.min + 1))
      actions.addToWallet(baseSalary)
    }

    actions.trackActivity(`Work: ${state.currentJobId ? (jobs[state.currentJobId]?.name || 'Unknown') : 'Unemployed'}`)

    // Show outcome notification
    notify({
      type: 'info',
      title: 'Work Complete',
      message: `You made ${baseSalary} WTC from ${job ? job.name : 'your job'}, but no bonus was awarded.`
    })

    // Start 10s cooldown and return to main UI
    onCooldownChange(true, 10)

    setTimeout(() => {
      onWorkComplete()
      setIsTransitioning(false)
      setCurrentQuestion(null)
      setSelectedAnswer(null)
      setTimeLeft(10)
    }, 100)
  }

  const getJobName = () => {
    if (!state.currentJobId) return 'Unemployed'
    const job = jobs[state.currentJobId]
    return job ? job.name : 'Unknown Job'
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Work</h2>

      {currentQuestion ? (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Work Question</h3>
            <p className="text-sm text-neutral-400">Answer correctly for a bonus! You have 10 seconds.</p>
            {currentQuestion && (
              <div className="mt-2">
                <div className="text-center">
                  <span className={`text-lg font-mono ${timeLeft <= 3 ? 'text-red-400' : 'text-white'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg text-left">
            <h4 className="text-lg mb-4 text-white">{currentQuestion.question}</h4>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-3 rounded-lg border transition-all duration-300 text-left ${
                    selectedAnswer === null
                      ? 'border-neutral-600 bg-neutral-700 hover:bg-neutral-600 hover:border-neutral-500'
                      : selectedAnswer === index
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-900'
                          : 'border-red-500 bg-red-900'
                        : 'border-neutral-600 bg-neutral-800'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSkip}
                disabled={selectedAnswer !== null}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Skip Question
              </button>
            </div>
          </div>

          {isTransitioning && (
            <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-neutral-400">Processing...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Work as {getJobName()}</h3>
          </div>

          <div className="grid gap-3">
            <button
              onClick={handleStartWork}
              disabled={isOnCooldown || isTransitioning}
              className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
                isOnCooldown || isTransitioning
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:scale-105'
              }`}
            >
              {isTransitioning ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Starting work...</span>
                </div>
              ) : (
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Answer Trivia Question</h4>
                    <div className="flex gap-2">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-700 text-blue-100">
                        Work
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 mb-2">
                    Answer questions correctly to earn bonuses at your job as {getJobName()}
                  </p>
                  <div className="text-xs text-neutral-400">
                    <p>10s timer • Base salary + bonuses • Items possible • 15s cooldown</p>
                  </div>
                </div>
              )}
            </button>
          </div>

          {isOnCooldown && !isTransitioning && (
            <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-neutral-400">Cooldown: {cooldownTime}s remaining</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
