import subprocess

for i in range(14, 34):
    path = f"questions/jvm/jvm-{i:03d}.md"
    result = subprocess.run(['git', 'show', f'4dfa357:{path}'], capture_output=True, text=True, encoding='utf-8')
    text = result.stdout
    
    ans_idx = text.find('---ANSWER---')
    analogy_idx = text.find('Life Analogy')
    
    print(f"{path}: ans={ans_idx}, analogy={analogy_idx}, analogy_before_ans={analogy_idx < ans_idx}")
