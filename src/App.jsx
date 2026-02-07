import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, twMerge } from 'tailwind-merge'

// SafeIcon component for Lucide icons
const SafeIcon = ({ name, size = 24, className, color }) => {
  const [Icon, setIcon] = useState(null)

  useEffect(() => {
    import('lucide-react').then((icons) => {
      const iconName = name.split('-').map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('')
      const FoundIcon = icons[iconName] || icons.HelpCircle
      setIcon(() => FoundIcon)
    })
  }, [name])

  if (!Icon) return <div style={{ width: size, height: size }} className={className} />

  return <Icon size={size} className={className} color={color} />
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Portfolio projects data
const PROJECTS = [
  {
    id: 1,
    title: 'Интернет-магазин',
    description: 'Современный e-commerce проект с корзиной и оплатой',
    tech: ['React', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    link: '#'
  },
  {
    id: 2,
    title: 'Корпоративный сайт',
    description: 'Лендинг для IT-компании с анимациями',
    tech: ['React', 'Tailwind', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    link: '#'
  },
  {
    id: 3,
    title: 'Приложение доставки',
    description: 'Мобильное PWA для службы доставки еды',
    tech: ['React', 'PWA', 'Firebase'],
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    link: '#'
  },
  {
    id: 4,
    title: 'Блог-платформа',
    description: 'CMS для ведения блога с Markdown',
    tech: ['Next.js', 'Prisma', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    link: '#'
  }
]

// Skills data
const SKILLS = [
  { name: 'React', icon: 'code-2' },
  { name: 'JavaScript', icon: 'file-json' },
  { name: 'TypeScript', icon: 'file-type' },
  { name: 'Node.js', icon: 'server' },
  { name: 'Tailwind', icon: 'palette' },
  { name: 'Git', icon: 'git-branch' }
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* HEADER */}
      <header
        className={twMerge(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="text-xl md:text-2xl font-bold text-slate-900">
              Portfolio
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Обо мне
              </a>
              <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Портфолио
              </a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Контакты
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} className="text-slate-900" />
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <a
                  href="#about"
                  onClick={(e) => scrollToSection(e, 'about')}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                >
                  Обо мне
                </a>
                <a
                  href="#portfolio"
                  onClick={(e) => scrollToSection(e, 'portfolio')}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                >
                  Портфолио
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, 'contact')}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                >
                  Контакты
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 md:px-6 bg-gradient-to-b from-slate-100 to-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-4 tracking-tight"
            >
              Привет, я <span className="text-indigo-600">Александр</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-slate-600 mb-8 font-medium"
            >
              Frontend-разработчик
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Создаю современные веб-приложения с акцентом на производительность и пользовательский опыт
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#portfolio"
                onClick={(e) => scrollToSection(e, 'portfolio')}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/25"
              >
                <SafeIcon name="briefcase" size={20} />
                Смотреть работы
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-xl font-semibold transition-all border-2 border-slate-200 hover:border-indigo-300"
              >
                <SafeIcon name="mail" size={20} />
                Связаться
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                Обо мне
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Я frontend-разработчик с 3-летним опытом создания современных веб-приложений. Специализируюсь на React-экосистеме и уделяю особое внимание деталям интерфейса и производительности.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Люблю чистый код, доступные интерфейсы и решение сложных задач простыми способами. Постоянно изучаю новые технологии и делюсь знаниями с комьюнити.
              </p>

              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default"
                  >
                    <SafeIcon name={skill.icon} size={18} />
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
                  alt="Workspace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="code" size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">3+</div>
                    <div className="text-sm text-slate-500">лет опыта</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="py-20 md:py-32 px-4 md:px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Портфолио
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Некоторые из моих последних проектов. Кликните для подробной информации.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <SafeIcon name="x" size={20} className="text-slate-900" />
                </button>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {selectedProject.description}. Этот проект был разработан с нуля, включая проектирование архитектуры, дизайн интерфейса и полную реализацию функционала. Особое внимание уделялось производительности и пользовательскому опыту.
                </p>
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                    Технологии
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <a
                    href={selectedProject.link}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <SafeIcon name="external-link" size={18} />
                    Открыть проект
                  </a>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                Давте работать вместе
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Открыт для новых проектов и интересных задач. Напишите мне — обсудим детали.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="mail" size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Email</div>
                    <a href="mailto:hello@example.com" className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors">
                      hello@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="map-pin" size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Локация</div>
                    <span className="text-slate-900 font-semibold">Москва, Россия</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <SafeIcon name="github" size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">GitHub</div>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors">
                      @username
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                      className="space-y-5"
                    >
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                          Имя
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="Ваше имя"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                          Сообщение
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows="4"
                          required
                          placeholder="Расскажите о проекте..."
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        ></textarea>
                      </div>

                      {isError && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Отправка...
                          </>
                        ) : (
                          <>
                            <SafeIcon name="send" size={20} />
                            Отправить сообщение
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SafeIcon name="check-circle" size={40} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        Сообщение отправлено!
                      </h3>
                      <p className="text-slate-600 mb-8">
                        Спасибо за обращение. Я свяжусь с вами в ближайшее время.
                      </p>
                      <button
                        onClick={resetForm}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                      >
                        Отправить ещё
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-xl font-bold mb-2">Portfolio</div>
              <div className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Александр. Все права защищены.
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <SafeIcon name="github" size={20} />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <SafeIcon name="send" size={20} />
              </a>
              <a
                href="mailto:hello@example.com"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <SafeIcon name="mail" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App