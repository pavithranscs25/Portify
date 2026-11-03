import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  Palette,
  Globe,
  Download,
  Code2,
  LayoutTemplate
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Sparkles,
    title: 'Simple Portfolio Builder',
    description: 'Turn your experience, projects and skills into a polished portfolio.'
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed portfolio templates.'
  },
  {
    icon: Globe,
    title: 'Publish Online',
    description: 'Share your portfolio with a unique public URL.'
  },
  {
    icon: Download,
    title: 'Export Portfolio',
    description: 'Download your portfolio and share it anywhere.'
  },
  {
    icon: Code2,
    title: 'Developer Focused',
    description: 'Showcase your skills, projects, experience and GitHub profile.'
  },
  {
    icon: LayoutTemplate,
    title: 'Live Preview',
    description: 'See your portfolio changes instantly while editing.'
  }
]

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="absolute left-1/2 top-10 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={16} />
            Your professional identity, simplified
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Your Portfolio.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Your Identity.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400">
            Create a stunning developer portfolio without writing a single
            line of frontend code. Customize, preview and publish it in minutes.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-4 font-semibold transition hover:bg-violet-500"
            >
              Create Your Portfolio
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/templates"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold text-gray-300 transition hover:bg-white/5"
            >
              Explore Templates
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-white/10 bg-[#121116] p-3 shadow-2xl shadow-violet-950/30">
          <div className="rounded-xl border border-white/10 bg-[#0c0b10] p-6 md:p-12">
            <div className="mb-8 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="grid items-center gap-8 text-left md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium text-violet-400">
                  FULL STACK DEVELOPER
                </p>
                <h2 className="text-4xl font-bold">Hello, I'm Alex.</h2>
                <p className="mt-4 leading-7 text-gray-400">
                  I build modern web applications and love turning ideas into
                  real-world products.
                </p>
                <div className="mt-6 flex gap-3">
                  <span className="rounded-lg bg-violet-600 px-4 py-2 text-sm">
                    Projects
                  </span>
                  <span className="rounded-lg border border-white/15 px-4 py-2 text-sm">
                    Contact
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex h-52 w-52 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20">
                  <Code2 size={90} className="text-violet-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Features
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything you need to stand out
          </h2>
          <p className="mt-4 text-gray-400">
            Build, customize and share your professional identity.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-violet-500/40"
              >
                <div className="mb-5 w-fit rounded-xl bg-violet-500/10 p-3 text-violet-400">
                  <Icon size={24} />
                </div>

                <h3 className="mb-3 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 px-6 py-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to build your portfolio?
          </h2>
          <p className="mt-4 text-gray-400">
            Your next opportunity starts with a great first impression.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-4 font-semibold hover:bg-violet-500"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
