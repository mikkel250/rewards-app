import React, { useEffect, useState } from "react";

function Rewards() {
  const [rewardsData, setRewardsData] = useState(null);

  useEffect(() => {
    // fetch the data when the component mounts
    fetchData();
  });

  const fetchData = () => {
    const githubFileUrl =
      "https://api.github.com/repos/mikkel250/rewards-app/contents/src/transactions.js";

    fetch(githubFileUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching data from Github!");
        }
      })
      .then((data) => {
        const fileContents = atob(data.content);
        const transactions = JSON.parse(fileContents);
        calculateRewards(transactions);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  const calculateRewards = (transactions) => {
    const rewardsData = {};

    transactions.forEach((transaction) => {
      const amount = transaction.amount;
      let points = 0;

      if (amount > 100) {
        points += (amount - 100) * 2;
      }

      if (amount > 50 && amount <= 100) {
        points += (amount - 50) * 1;
      }

      // group rewards by month
      const month = new Date().getMonth();
      if (!rewardsData[month]) {
        rewardsData[month] = {
          totalPoints: 0,
          monthlyPoints: {},
        };
      }

      rewardsData[month].totalPoints += points;

      // group rewards by transaction
      rewardsData[month].monthlyPoints[transaction.id] = points;
    });

    // display the rewardsData or pass it to child component for rendering
    setRewardsData(rewardsData);
  };

  if (!rewardsData) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <h2>Rewards Points</h2>
      <ul>
        {Object.entries(rewardsData).map(([month, rewards]) => {
          <li key={month}>
            <strong>Month: {month}</strong>
            <div>Total Points: {rewards.totalPoints}</div>
            <ul>
              {Object.entries(rewards.monthlyPoints).map(
                ([transactionId, points]) => (
                  <li key={transactionId}>
                    Transaction {transactionId}: {points} points
                  </li>
                )
              )}
            </ul>
          </li>;
        })}
      </ul>
    </div>
  );
}

export default Rewards;
