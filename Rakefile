
desc "Put all of Jasmine for webOS into one file"
task :concat_sources do

  puts 'Building Jasmine webOS from source'

  sources = build_sources

  old_files = Dir.glob('app/lib/*.js')
  old_files.each { |file| File.delete(file) }

  File.open("app/lib/jasmine-webos.js", 'w') do |single_file|
    sources.each do |source_filename|
      single_file.puts(File.read(source_filename))
    end

    single_file.puts %{
jasmine.webos.version = {
  "major": #{version_data['major']},
  "minor": #{version_data['minor']},
  "build": #{version_data['build']},
  "revision": #{Time.now.to_i}
};
}
  end
end

desc "Make a "
task :build => :concat_sources do

end



def build_sources
  sources = ['src/jasmine-webos-core.js', 'src/proxy-app-assistant.js']
  sources += Dir.glob('src/*.js').reject { |f| sources.include?(f) }.sort
  sources
end

def version_string
  "#{version_data['major']}.#{version_data['minor']}.#{version_data['build']}"
end

def version_data
  require 'json'
  @version ||= JSON.parse(File.new("version.json").read);
end

