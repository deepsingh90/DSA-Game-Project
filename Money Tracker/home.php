<?php 
   session_start();

   include("php/config.php");
   if(!isset($_SESSION['valid'])){
    header("Location: index.php");
   }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Home</title>
</head>
<body>
    <div class="nav">
        <div class="welcome">
            <p><a href="home.php">Hello, welcome</a> </p>
        </div>

        <div class="right-links">

            <?php 
            
            $id = $_SESSION['id'];
            $query = mysqli_query($con,"SELECT*FROM users WHERE Id=$id");

            while($result = mysqli_fetch_assoc($query)){
                $res_Uname = $result['Username'];
                $res_Email = $result['Email'];
                $res_Age = $result['Age'];
                $res_id = $result['Id'];
            }
            
            echo "<a href='edit.php?Id=$res_id'>Change Profile</a>";
            ?>

            <a href="php/logout.php"> <button class="btn">Log Out</button> </a>

        </div>
    </div>
    <div class="merged">
    <div class="container">
        <header>
            <h1>Monthly Savings Tracker</h1>
        </header>

        <section class="form-section">
            <div class="input-group">
                <label for="income">Set Monthly Income:</label>
                <input type="number" id="income" placeholder="Enter your income">
                <button id="setIncome" class="btn primary-btn">Set Income</button>
            </div>

            <div class="input-group">
                <label for="expenseName">Expense Name:</label>
                <input type="text" id="expenseName" placeholder="Enter expense name">
            </div>

            <div class="input-group">
                <label for="expenseAmount">Expense Amount:</label>
                <input type="number" id="expenseAmount" placeholder="Enter expense amount">
                <button id="addExpense" class="btn secondary-btn">Add Expense</button>
            </div>
        </section>

        <section class="output-section">
            <div class="output-group">
                <h2>Income: <span id="displayIncome">$0.00</span></h2>
                <h2>Total Expenses: <span id="displayExpenses">$0.00</span></h2>
                <h2>Savings: <span id="displaySavings">$0.00</span></h2>
            </div>

            <div class="expense-list">
                <h3>Expense List:</h3>
                <ul id="expenseList"></ul>
            </div>

            <!-- Placeholder for compound interest table -->
            <div id="compoundInterestTable"></div>
        </section>
    </div>
    </div>

    <script src="script.js"></script>


</body>
</html>