import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

body_tag = '<body class="bg-lightBg dark:bg-darkBg text-slate-800 dark:text-slate-200 min-h-screen flex flex-col font-sans transition-colors duration-300">'
glow_elements = '''
    <!-- Ambient glowing background for glassmorphism -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700 dark:opacity-100 opacity-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-500/20 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent-500/10 rounded-full blur-[150px]"></div>
        <div class="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[130px]"></div>
    </div>
    <!-- Make sure main content is above background -->
    <div class="relative z-10 flex flex-col min-h-screen">
'''
if 'Ambient glowing background' not in content:
    content = content.replace(body_tag, body_tag + glow_elements)
    content = content.replace('</body>', '</div>\n</body>')

# Regex to make cards translucent
content = re.sub(r'dark:bg-darkCard(?!\/\d+)(?! backdrop-blur)', r'dark:bg-darkCard/60 backdrop-blur-xl', content)
content = content.replace('backdrop-blur-xl backdrop-blur-md', 'backdrop-blur-xl') # fix potential duplicate in header
content = content.replace('dark:bg-darkCard/80 backdrop-blur-md', 'dark:bg-darkCard/60 backdrop-blur-xl')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
