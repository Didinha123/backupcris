const header = document.getElementById('header');
const nav = document.getElementById('nav');
const toggle = document.getElementById('menuToggle');

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll);
onScroll();

toggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  toggle.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.classList.remove('open');
  });
});

// Animação de entrada ao rolar
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  observer.observe(el);
});

// Mantém só uma pergunta aberta por vez
const faqs = document.querySelectorAll('.faq__list details');
faqs.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach(o => o !== d && (o.open = false));
}));

document.getElementById('year').textContent = new Date().getFullYear();

// Contagem de cliques nos botões de WhatsApp e Instagram (Supabase)
const SUPABASE_URL = 'https://hdayhqjcfvpbtxjlxkxb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xzGwmmvmCbPC6kyUGrEpyQ_euEk4SNp';
const SUPABASE_TABELA = 'cliques_site';

// Nome do lugar do site onde o botão está (ex.: "inicio", "servicos", "rodape")
const localDoBotao = link => {
  if (link.classList.contains('wpp-float')) return 'flutuante';
  if (link.closest('.header')) return 'cabecalho';
  if (link.closest('.footer')) return 'rodape';
  if (link.closest('.cta')) return 'chamada-final';
  const secao = link.closest('section[id]');
  return secao ? secao.id : 'outro';
};

const registrarClique = (botao, pagina, link) => {
  fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABELA}`, {
    method: 'POST',
    keepalive: true, // garante o envio mesmo se a pessoa sair da página
    headers: {
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ botao, pagina, link })
  }).catch(() => {});
};

document.querySelectorAll('a[href*="wa.me"], a[href*="instagram.com"]').forEach(link => {
  const tipo = link.href.includes('wa.me') ? 'whatsapp' : 'instagram';
  link.addEventListener('click', () => registrarClique(tipo, localDoBotao(link), link.href));
});
