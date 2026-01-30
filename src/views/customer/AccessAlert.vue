<script setup>
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FD] p-6 text-center font-sans">

        <div
            class="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200 mb-8 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor"
                class="bi bi-qr-code-scan" viewBox="0 0 16 16">
                <path
                    d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z" />
                <path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z" />
                <path d="M7 9H2v5h5zm-4 1h3v3H3zm8-6h1v1h-1z" />
                <path
                    d="M9 2h5v5H9zm1 1v3h3V3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8zm2 2H9V9h1zm4 2h-1v1h-2v1h3zm-4 2v-1H8v1z" />
                <path d="M12 9h2V8h-2z" />
            </svg>
        </div>

        <h1 class="text-3xl font-black text-gray-900 mb-3">Scan QR Required</h1>

        <p class="text-gray-500 font-medium max-w-xs mx-auto leading-relaxed mb-10">
            For ordering, please <strong>Scan QR Code</strong> on the table with your phone scanner to start order!
        </p>

        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mb-8">
            <div class="flex items-center gap-4 text-left">
                <div
                    class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold">
                    1</div>
                <p class="text-sm text-gray-600">Open your phone scanner or camera</p>
            </div>
            <div class="w-0.5 h-4 bg-gray-200 ml-5 my-1"></div>
            <div class="flex items-center gap-4 text-left">
                <div
                    class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold">
                    2</div>
                <p class="text-sm text-gray-600">Scan QR Code on the table</p>
            </div>
            <div class="w-0.5 h-4 bg-gray-200 ml-5 my-1"></div>
            <div class="flex items-center gap-4 text-left">
                <div
                    class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                    3</div>
                <p class="text-sm text-gray-600">Click the appear link to start ordering</p>
            </div>
        </div>

        <p class="text-xs text-gray-400">© GloryCafe System</p>
    </div>
</template>