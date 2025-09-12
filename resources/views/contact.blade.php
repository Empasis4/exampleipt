<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Info</title>
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body>
    <div class="container" style="max-width:600px; margin:50px auto;">
        <h2>Contact Us</h2>

        @if(session('success'))
            <div style="background: #d4edda; padding: 10px; margin-bottom: 15px; color:#155724;">
                {{ session('success') }}
            </div>
        @endif

        <form method="POST" action="/contact">
            @csrf
            <div style="margin-bottom: 10px;">
                <label for="name">FullName:</label><br>
                <input type="text" name="name" required style="width:100%; padding:8px;">
            </div>

            <div style="margin-bottom: 10px;">
                <label for="email">Email:</label><br>
                <input type="email" name="email" required style="width:100%; padding:8px;">
            </div>

            <div style="margin-bottom: 10px;">
                <label for="message">Message:</label><br>
                <textarea name="message" rows="5" required style="width:100%; padding:8px;"></textarea>
            </div>

            <button type="submit" style="padding:10px 20px; background:#007bff; color:white; border:none; cursor:pointer;">
                Send
            </button>
        </form>
    </div>
</body>
</html>
