import os

html_path = 'c:\\java-prep\\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

modal_html = """
    <!-- Adaptive Quiz Modal -->
    <div id="adaptive-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-opacity opacity-0">
        <div class="bg-white dark:bg-darkCard rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 m-4">
            <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <i class="fa-solid fa-graduation-cap text-emerald-500 text-lg"></i>
                    </div>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white">Адаптивный План</h2>
                </div>
                <button id="close-adaptive-modal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6" id="adaptive-quiz-container">
                <!-- Level Selection -->
                <div id="adaptive-step-1" class="space-y-6">
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Выберите ваш целевой уровень</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">Мы проведем быстрый тест (около 8 вопросов), чтобы выявить ваши пробелы и составить персональный план подготовки.</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button class="level-select-btn p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold transition-colors" data-level="Junior">Junior</button>
                        <button class="level-select-btn p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold transition-colors" data-level="Middle">Middle</button>
                        <button class="level-select-btn p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold transition-colors" data-level="Senior">Senior</button>
                    </div>
                </div>

                <!-- Quiz Area -->
                <div id="adaptive-step-2" class="hidden space-y-6">
                    <div class="flex justify-between items-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                        <span id="quiz-progress-text">Вопрос 1 из 8</span>
                        <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md" id="quiz-level-badge">Middle</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div id="quiz-progress-bar" class="bg-emerald-500 h-2 rounded-full transition-all" style="width: 10%"></div>
                    </div>
                    
                    <div class="mt-8">
                        <h3 id="quiz-question-text" class="text-xl font-semibold text-slate-900 dark:text-white leading-tight">...</h3>
                        <div id="quiz-options" class="mt-6 space-y-3">
                            <!-- Options injected here -->
                        </div>
                    </div>
                </div>

                <!-- Results -->
                <div id="adaptive-step-3" class="hidden space-y-6 text-center py-6">
                    <div class="w-20 h-20 mx-auto bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-4">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Тест завершен!</h3>
                    <p class="text-slate-600 dark:text-slate-300" id="quiz-results-text">Мы проанализировали ваши ответы и составили персональный план.</p>
                    <button id="apply-adaptive-plan" class="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">Показать мой план</button>
                </div>
            </div>
        </div>
    </div>
"""

scripts_to_inject = """
    <script src="adaptive.js"></script>
"""

if 'adaptive.js' not in content:
    content = content.replace('</body>', modal_html + scripts_to_inject + '\n</body>')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected modal and script.")
else:
    print("Already injected.")
