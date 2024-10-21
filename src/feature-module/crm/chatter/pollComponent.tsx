import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PollComponentProps {
    pollQuestion: string;
    pollChoices: string[];
}

const PollComponent = ({ pollQuestion, pollChoices }: PollComponentProps) => {
    const { t } = useTranslation();
    const [votes, setVotes] = useState<number[]>(new Array(pollChoices.length).fill(0));
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Handle vote selection
    const handleVoteSelection = (index: number) => {
        setSelectedChoice(index);
    };

    // Handle submitting the vote
    const handleSubmitVote = () => {
        if (selectedChoice !== null) {
            const updatedVotes = [...votes];
            updatedVotes[selectedChoice] += 1;
            setVotes(updatedVotes);
            setHasVoted(true);
        }
    };

    // Calculate total votes
    const totalVotes = votes.reduce((acc, cur) => acc + cur, 0);

    // Render poll options
    const renderPollChoices = () => {
        return pollChoices.map((choice, index) => (
            <div key={index} className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    id={`choice${index}`}
                    checked={selectedChoice === index}
                    onChange={() => handleVoteSelection(index)}
                    disabled={hasVoted}
                />
                <label className="form-check-label" htmlFor={`choice${index}`}>
                    {choice}
                </label>
            </div>
        ));
    };

    // Render vote button or results
    const renderVoteButtonOrResults = () => {
        if (!hasVoted) {
            return (
                <button className="btn btn-primary" onClick={handleSubmitVote}>
                    {t("LABEL.CHATTER.SUBMIT_VOTE")}
                </button>
            );
        } else {
            return (
                <div>
                    <h4>{t("LABEL.CHATTER.POLL_RESULTS")}</h4>
                    {pollChoices.map((choice, index) => (
                        <div key={index}>
                            {choice}: {votes[index]} ({((votes[index] / totalVotes) * 100).toFixed(2)}%)
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div>
            <h3>{pollQuestion}</h3>
            {!hasVoted && (
                <div>
                    {renderPollChoices()}
                </div>
            )}
            {renderVoteButtonOrResults()}
        </div>
    );
};

export default PollComponent;
