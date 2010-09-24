desc "Put all of Jasmine for webOS into one file"
task :concat_sources do

  FileUtils.mkdir_p("#{plugin_dir}/app/lib")

  old_files = Dir.glob("#{plugin_dir}/app/lib/*.js")
  old_files.each { |file| File.delete(file) }

  puts "\nBuilding Jasmine webOS file for Device/Emulator".yellow.bold

  concat("#{plugin_dir}/app/lib/jasmine-webos.js", build_sources)

  puts "\nBuilding Jasmine webOS file for desktop browsers".yellow.bold

  concat("#{plugin_dir}/app/lib/jasmine-webos-browser.js", browser_sources)
end

desc "Make a zip file that contains the entire Jasmine webOS plugin"
task :build => :concat_sources do

  require 'tmpdir'

  temp_dir = File.join(Dir.tmpdir, 'jasmine-webos-plugin')
  puts "Building Jasmine webOS plugin in #{temp_dir}".yellow
  FileUtils.rm_r temp_dir if File.exists?(temp_dir)

  build_root = File.join(temp_dir, 'plugins/jasmine-webos')
  FileUtils.mkdir_p(build_root)

  plugin_root = File.join(File.expand_path(File.dirname(__FILE__)), '..', 'plugins/jasmine-webos')
  ['app', 'images', 'stylesheets', 'sources.json'].each do |path|
    FileUtils.cp_r File.join(plugin_root, path), build_root
  end

  zip_file_name = File.join("#{plugin_root}/..", "jasmine-webos-plugin-#{version_string}.zip")

  if File.exist?(zip_file_name)
    puts "WARNING!!! #{zip_file_name} already exists!"
    FileUtils.rm(zip_file_name)
  end

  puts "Zipping Jasmine webOS plugin to plugins/jasmine-webos-plugin-#{version_string}.zip".yellow
  exec "cd #{temp_dir} && zip -r #{zip_file_name} . -x .[a-zA-Z0-9]*"
  exec "ls -alF plugins/*.zip"
end

def build_sources
  sources = [File.join(source_dir, 'jasmine-webos-core.js'),
             File.join(source_dir, 'proxy-app-assistant.js')]
  sources += Dir.glob("#{source_dir}/**/*.js").reject { |f| sources.include?(f) }.sort
  sources
end

def browser_sources
  sources = [File.join(source_dir, 'jasmine-webos-core.js')]
  sources += Dir.glob("#{source_dir}/browser/**/*.js")
  sources += Dir.glob("#{plugin_dir}/spec/helpers/*.js")
  sources
end

def version_string
  "#{version_data['major']}.#{version_data['minor']}.#{version_data['build']}"
end

def version_object
  %{

jasmine.webos.version = {
  "major": #{version_data['major']},
  "minor": #{version_data['minor']},
  "build": #{version_data['build']},
  "revision": #{version_data['revision']}
};

}
end

def version_data
  @version ||= begin
    appinfo = JSON.parse(File.new("appinfo.json").read)
    v = appinfo['version'].split('.')
    {'major' => v[0], 'minor' => v[1], 'build' => v[2], 'revision' => Time.now.to_i}
  end
end

def root
  File.expand_path(File.dirname(__FILE__))
end

def plugin_dir
  'plugins/jasmine-webos'
end

def source_dir
  "#{plugin_dir}/src"
end

def concat(filename, sources)

  puts "Building #{filename}:".green

  File.open(filename, 'w') do |single_file|
    sources.each do |source_filename|
      puts "Adding #{source_filename}"
      single_file.puts(File.read(source_filename))
    end

    single_file.puts version_object
  end

end