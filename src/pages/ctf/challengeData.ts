import { Challenge } from './types'

export const challenges: Challenge[] = [
  // ============================================
  // EASY CHALLENGES (10)
  // ============================================
  {
    id: 'web-easy-1',
    title: 'Robot Dreams',
    description: 'Every good website has rules for robots. Maybe this one is hiding something interesting in plain sight. Can you find what the webmaster wants to keep hidden from search engines?',
    category: 'web',
    difficulty: 'easy',
    points: 100,
    hint: 'What file tells robots where they can and cannot go?',
    flag: 'DACC{r0b0ts_txt_1s_n0t_s3cur1ty}',
    author: 'DACC Team'
  },
  {
    id: 'web-easy-2',
    title: 'Inspector Gadget',
    description: 'Sometimes developers leave comments in their code that they probably shouldn\'t. Take a close look at the source - developers can be quite chatty.',
    category: 'web',
    difficulty: 'easy',
    points: 100,
    hint: 'Right-click and View Page Source, or use browser dev tools',
    flag: 'DACC{html_c0mm3nts_4r3_publ1c}',
    author: 'DACC Team'
  },
  {
    id: 'crypto-easy-1',
    title: 'Caesar\'s Secret',
    description: 'Julius Caesar used a simple cipher to communicate with his generals. Decrypt this message:\n\nGDFF{urwdwlrq_lv_mxvw_wkh_ehjlqqlqj}',
    category: 'crypto',
    difficulty: 'easy',
    points: 100,
    hint: 'Try shifting the alphabet. The classic shift is 3 positions.',
    flag: 'DACC{rotation_is_just_the_beginning}',
    author: 'DACC Team'
  },
  {
    id: 'crypto-easy-2',
    title: 'Not So Secret',
    description: 'This message looks like gibberish, but it\'s actually encoded in a very common format:\n\nREFDQ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259',
    category: 'crypto',
    difficulty: 'easy',
    points: 100,
    hint: 'The encoding scheme has a number in its name...',
    flag: 'DACC{base64_is_not_encryption}',
    author: 'DACC Team'
  },
  {
    id: 'forensics-easy-1',
    title: 'Hidden in Plain Sight',
    description: 'This image looks normal, but there\'s more than meets the eye. Sometimes data hides in the metadata.',
    category: 'forensics',
    difficulty: 'easy',
    points: 100,
    hint: 'Try using exiftool or checking the image properties',
    flag: 'DACC{metadata_tells_all}',
    files: [{ name: 'innocent.jpg', url: '/ctf/files/innocent.jpg' }],
    author: 'DACC Team'
  },
  {
    id: 'forensics-easy-2',
    title: 'Strings Attached',
    description: 'Binary files can contain readable text. Search through this file to find the hidden flag.',
    category: 'forensics',
    difficulty: 'easy',
    points: 100,
    hint: 'The "strings" command is your friend',
    flag: 'DACC{str1ngs_r3v34l_s3cr3ts}',
    files: [{ name: 'mystery.bin', url: '/ctf/files/mystery.bin' }],
    author: 'DACC Team'
  },
  {
    id: 'misc-easy-1',
    title: 'QR Quest',
    description: 'QR codes are everywhere these days. Scan this one to reveal the flag.',
    category: 'misc',
    difficulty: 'easy',
    points: 100,
    hint: 'Any QR code scanner app or website will work',
    flag: 'DACC{qr_c0d3s_4r3_fun}',
    files: [{ name: 'flag.png', url: '/ctf/files/qr.png' }],
    author: 'DACC Team'
  },
  {
    id: 'misc-easy-2',
    title: 'Hex Marks the Spot',
    description: 'Convert this hexadecimal to ASCII to find the flag:\n\n44414343 7b683378 5f746f5f 61736331 697d',
    category: 'misc',
    difficulty: 'easy',
    points: 100,
    hint: 'Each pair of hex digits represents one ASCII character',
    flag: 'DACC{h3x_to_asc1i}',
    author: 'DACC Team'
  },
  {
    id: 'reverse-easy-1',
    title: 'Python Pickle',
    description: 'This Python script checks for the correct password. Can you figure out what it is?\n\n```python\ndef check(password):\n    return password == "DACC{" + "pyth0n" + "_" + "b4s1cs" + "}"\n```',
    category: 'reverse',
    difficulty: 'easy',
    points: 100,
    hint: 'Just read the code carefully',
    flag: 'DACC{pyth0n_b4s1cs}',
    author: 'DACC Team'
  },
  {
    id: 'pwn-easy-1',
    title: 'Buffer Baby',
    description: 'This program has a simple buffer overflow. It reads your name and checks a password variable. Can you make it say you\'re an admin?\n\n```c\nchar password[8] = "no";\nchar name[8];\ngets(name);\nif(strcmp(password, "yes") == 0) {\n    print_flag();\n}\n```',
    category: 'pwn',
    difficulty: 'easy',
    points: 100,
    hint: 'What happens if your name is longer than 8 characters?',
    flag: 'DACC{buff3r_0v3rfl0w_101}',
    author: 'DACC Team'
  },

  // ============================================
  // MEDIUM CHALLENGES (10)
  // ============================================
  {
    id: 'web-medium-1',
    title: 'Cookie Monster',
    description: 'This website uses cookies for authentication. The admin cookie seems to be set to "false". Can you become an admin?',
    category: 'web',
    difficulty: 'medium',
    points: 200,
    hint: 'Browser dev tools let you edit cookies',
    flag: 'DACC{c00k13_m4n1pul4t10n}',
    author: 'DACC Team'
  },
  {
    id: 'web-medium-2',
    title: 'SQL 101',
    description: 'This login form seems vulnerable. The classic username/password combination might just work...',
    category: 'web',
    difficulty: 'medium',
    points: 200,
    hint: 'What happens if you put a single quote in the username?',
    flag: 'DACC{sql_1nj3ct10n_ftw}',
    author: 'DACC Team'
  },
  {
    id: 'crypto-medium-1',
    title: 'Vigenère Vendetta',
    description: 'This cipher is harder than Caesar\'s, but with a short key, it\'s still breakable:\n\nEDGF{klhuwggsi_ps_iwj_dmhw}',
    category: 'crypto',
    difficulty: 'medium',
    points: 200,
    hint: 'The key is a common 3-letter word',
    flag: 'DACC{vigenere_is_not_safe}',
    author: 'DACC Team'
  },
  {
    id: 'crypto-medium-2',
    title: 'Hash Crasher',
    description: 'MD5 hashes are no longer secure. Can you crack this one?\n\n5f4dcc3b5aa765d61d8327deb882cf99',
    category: 'crypto',
    difficulty: 'medium',
    points: 200,
    hint: 'Try an online hash cracker or rainbow table',
    flag: 'DACC{password}',
    author: 'DACC Team'
  },
  {
    id: 'forensics-medium-1',
    title: 'Packet Detective',
    description: 'We captured network traffic from a suspicious user. Find the password they transmitted.',
    category: 'forensics',
    difficulty: 'medium',
    points: 200,
    hint: 'Open the pcap in Wireshark and follow the TCP stream',
    flag: 'DACC{w1r3sh4rk_m4st3r}',
    files: [{ name: 'capture.pcap', url: '/ctf/files/capture.pcap' }],
    author: 'DACC Team'
  },
  {
    id: 'forensics-medium-2',
    title: 'Stego Secrets',
    description: 'There\'s a secret message hidden in this image using steganography. Can you extract it?',
    category: 'forensics',
    difficulty: 'medium',
    points: 200,
    hint: 'Try steghide or similar tools',
    flag: 'DACC{st3g0_h1dd3n_d4t4}',
    files: [{ name: 'landscape.png', url: '/ctf/files/landscape.png' }],
    author: 'DACC Team'
  },
  {
    id: 'reverse-medium-1',
    title: 'Crackme Junior',
    description: 'This binary checks for the correct serial key. Reverse engineer it to find the valid key.',
    category: 'reverse',
    difficulty: 'medium',
    points: 200,
    hint: 'Use Ghidra or IDA to decompile the binary',
    flag: 'DACC{r3v3rs3_3ng1n33r}',
    files: [{ name: 'crackme', url: '/ctf/files/crackme' }],
    author: 'DACC Team'
  },
  {
    id: 'reverse-medium-2',
    title: 'Android Recon',
    description: 'This Android app hides a secret. Decompile the APK and find the hardcoded flag.',
    category: 'reverse',
    difficulty: 'medium',
    points: 200,
    hint: 'jadx or apktool can decompile APK files',
    flag: 'DACC{4pkt00l_m4st3r}',
    files: [{ name: 'secret.apk', url: '/ctf/files/secret.apk' }],
    author: 'DACC Team'
  },
  {
    id: 'pwn-medium-1',
    title: 'Format Frenzy',
    description: 'This program uses printf unsafely. Can you leak the flag from the stack?',
    category: 'pwn',
    difficulty: 'medium',
    points: 200,
    hint: 'Try %x or %s format specifiers',
    flag: 'DACC{f0rm4t_str1ng_l34k}',
    author: 'DACC Team'
  },
  {
    id: 'misc-medium-1',
    title: 'Git Detective',
    description: 'The developer accidentally committed a secret and then tried to remove it. But git never forgets...',
    category: 'misc',
    difficulty: 'medium',
    points: 200,
    hint: 'Check the git history and previous commits',
    flag: 'DACC{g1t_h1st0ry_n3v3r_f0rg3ts}',
    files: [{ name: 'repo.zip', url: '/ctf/files/repo.zip' }],
    author: 'DACC Team'
  },

  // ============================================
  // HARD CHALLENGES (10)
  // ============================================
  {
    id: 'web-hard-1',
    title: 'SSTI Sorcery',
    description: 'This Flask app renders user input in templates. Can you achieve server-side template injection?',
    category: 'web',
    difficulty: 'hard',
    points: 300,
    hint: 'Try {{7*7}} and see what happens',
    flag: 'DACC{sst1_t0_rc3}',
    author: 'DACC Team'
  },
  {
    id: 'web-hard-2',
    title: 'JWT Juggler',
    description: 'This API uses JWT for authentication. The tokens are signed, but maybe there\'s a weakness in how they verify...',
    category: 'web',
    difficulty: 'hard',
    points: 300,
    hint: 'What if you change the algorithm to "none"?',
    flag: 'DACC{jwt_4lg0_c0nfus10n}',
    author: 'DACC Team'
  },
  {
    id: 'crypto-hard-1',
    title: 'RSA Rookie Mistake',
    description: 'We intercepted an RSA-encrypted message. The public key has n=143 and e=7. The ciphertext is 48. What\'s the plaintext?',
    category: 'crypto',
    difficulty: 'hard',
    points: 300,
    hint: 'With small n, you can factor it easily to find p and q',
    flag: 'DACC{sm4ll_n_1s_f4t4l}',
    author: 'DACC Team'
  },
  {
    id: 'crypto-hard-2',
    title: 'XOR Xplorer',
    description: 'This message was encrypted with a repeating XOR key. The key is 4 bytes long.\n\nEncrypted (hex): 1b0e1a1f5d0e1f1a0b0c1d5d1f1e1b1c',
    category: 'crypto',
    difficulty: 'hard',
    points: 300,
    hint: 'If you know part of the plaintext starts with "DACC", you can find the key',
    flag: 'DACC{x0r_k3y_f0und}',
    author: 'DACC Team'
  },
  {
    id: 'forensics-hard-1',
    title: 'Memory Lane',
    description: 'Analyze this memory dump to find the password the user typed.',
    category: 'forensics',
    difficulty: 'hard',
    points: 300,
    hint: 'Volatility is the go-to tool for memory forensics',
    flag: 'DACC{v0l4t1l1ty_pr0}',
    files: [{ name: 'memdump.raw', url: '/ctf/files/memdump.raw' }],
    author: 'DACC Team'
  },
  {
    id: 'forensics-hard-2',
    title: 'Deleted But Not Gone',
    description: 'The suspect deleted an important file from this disk image. Can you recover it?',
    category: 'forensics',
    difficulty: 'hard',
    points: 300,
    hint: 'autopsy or foremost can help recover deleted files',
    flag: 'DACC{f1l3_r3c0v3ry_ftw}',
    files: [{ name: 'disk.img', url: '/ctf/files/disk.img' }],
    author: 'DACC Team'
  },
  {
    id: 'reverse-hard-1',
    title: 'Obfuscated Odyssey',
    description: 'This binary is heavily obfuscated. Strip away the anti-debugging techniques to find the flag.',
    category: 'reverse',
    difficulty: 'hard',
    points: 300,
    hint: 'Patch out the anti-debug checks or use a debugger that can bypass them',
    flag: 'DACC{4nt1_d3bug_byp4ss3d}',
    files: [{ name: 'obfuscated', url: '/ctf/files/obfuscated' }],
    author: 'DACC Team'
  },
  {
    id: 'reverse-hard-2',
    title: 'Malware Analysis',
    description: 'Analyze this malware sample (safely!) to find the C2 server URL embedded in it.',
    category: 'reverse',
    difficulty: 'hard',
    points: 300,
    hint: 'String decryption routines are common in malware',
    flag: 'DACC{m4lw4r3_4n4lyst}',
    files: [{ name: 'sample.exe', url: '/ctf/files/sample.exe' }],
    author: 'DACC Team'
  },
  {
    id: 'pwn-hard-1',
    title: 'ROP Chain Gang',
    description: 'NX is enabled, so you can\'t execute shellcode on the stack. Build a ROP chain to call system("/bin/sh").',
    category: 'pwn',
    difficulty: 'hard',
    points: 300,
    hint: 'Use ROPgadget to find useful gadgets',
    flag: 'DACC{r0p_ch41n_m4st3r}',
    files: [{ name: 'rop_me', url: '/ctf/files/rop_me' }],
    author: 'DACC Team'
  },
  {
    id: 'pwn-hard-2',
    title: 'Heap Havoc',
    description: 'This program has a use-after-free vulnerability. Exploit it to get the flag.',
    category: 'pwn',
    difficulty: 'hard',
    points: 300,
    hint: 'Allocate chunks in the right order to control freed memory',
    flag: 'DACC{h34p_3xpl01t4t10n}',
    files: [{ name: 'heap_chall', url: '/ctf/files/heap_chall' }],
    author: 'DACC Team'
  },

  // ============================================
  // BEAST CHALLENGE (1)
  // ============================================
  {
    id: 'beast-1',
    title: 'The Final Boss',
    description: `You've made it to the ultimate challenge. This multi-stage problem combines everything you've learned:

**Stage 1:** A website with multiple vulnerabilities chained together
**Stage 2:** Encrypted communications to decode
**Stage 3:** A binary to reverse engineer
**Stage 4:** Memory forensics to find the final piece

Only the most skilled hackers will conquer this challenge. Do you have what it takes to claim the title of BEAST?

The clock is ticking. The flag awaits those worthy of legend.`,
    category: 'misc',
    difficulty: 'beast',
    points: 500,
    hint: 'Each stage gives you a piece of the puzzle. The final flag combines all four parts.',
    flag: 'DACC{b34st_m0d3_4ct1v4t3d_y0u_4r3_4_l3g3nd}',
    files: [
      { name: 'beast_stage1.zip', url: '/ctf/files/beast_stage1.zip' },
      { name: 'beast_stage2.enc', url: '/ctf/files/beast_stage2.enc' },
      { name: 'beast_stage3', url: '/ctf/files/beast_stage3' },
      { name: 'beast_stage4.raw', url: '/ctf/files/beast_stage4.raw' }
    ],
    author: 'DACC Elite Team'
  }
]

export const getChallengesByDifficulty = (difficulty: string) =>
  challenges.filter(c => c.difficulty === difficulty)

export const getChallengesByCategory = (category: string) =>
  challenges.filter(c => c.category === category)

export const getChallengeById = (id: string) =>
  challenges.find(c => c.id === id)
