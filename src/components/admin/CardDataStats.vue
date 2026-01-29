<script setup>
defineProps({
    title: String,
    total: String,
    rate: String,
    levelUp: Boolean,
});
</script>

<template>
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <slot name="icon"></slot>
        </div>

        <div class="flex items-end justify-between mt-5">
            <div>
                <span class="text-md text-gray-500 dark:text-gray-400">{{ title }}</span>
                <h4 class="mt-2 font-bold text-gray-800 text-title-sm">
                    {{ total }}
                </h4>
            </div>

            <span class="flex items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium" :class="levelUp
                ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'">
                <svg v-if="levelUp" class="fill-current" width="12" height="12" viewBox="0 0 12 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                        fill="" />
                </svg>
                <svg v-else class="fill-current" width="12" height="12" viewBox="0 0 12 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5.64284 8.69237L9.09103 5.33987L10 6.22362L5 11.0849L-8.98485e-07 6.22362L0.908973 5.33987L4.35716 8.69237V1.08487L5.64284 1.08487V8.69237Z" />
                </svg>
                {{ rate }}
            </span>
        </div>
    </div>
</template>