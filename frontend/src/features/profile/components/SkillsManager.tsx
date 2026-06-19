import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useSkills, useAddSkill, useRemoveSkill } from '../hooks/useSkills.ts'
import { Button } from '../../../components/ui/button.tsx'
import { Badge } from '../../../components/Badge.tsx'
import { Input } from '../../../components/ui/input.tsx'
import { Label } from '../../../components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx'
import { FeedSkeleton } from '../../../components/LoadingSkeleton.tsx'
import { EmptyState } from '../../../components/common/index.ts'
import { SKILL_LEVELS } from '../../../lib/constants.ts'

interface SkillsManagerProps {
  userId: string
  isOwnProfile: boolean
}

export function SkillsManager({ userId, isOwnProfile }: SkillsManagerProps) {
  const { data: skills, isLoading } = useSkills(userId)
  const addSkill = useAddSkill()
  const removeSkill = useRemoveSkill()
  const [newSkill, setNewSkill] = useState('')
  const [newLevel, setNewLevel] = useState('Intermediate')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    addSkill.mutate(
      { skill: newSkill.trim(), level: newLevel },
      {
        onSuccess: () => {
          setNewSkill('')
          setNewLevel('Intermediate')
          setIsAdding(false)
        },
      }
    )
  }

  if (isLoading) {
    return <FeedSkeleton />
  }

  const skillList = skills || []

  return (
    <div className="space-y-4">
      {skillList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skillList.map((skill) => (
            <Badge key={skill.id} variant="neutral" className="gap-2 rounded-full px-3 py-1">
              <span className="font-medium text-[var(--foreground)]">{skill.skill}</span>
              <span className="text-[var(--muted-foreground)]">({skill.level})</span>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => removeSkill.mutate(skill.id)}
                  className="rounded-full p-0.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  aria-label={`Remove ${skill.skill}`}
                  disabled={removeSkill.isPending}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No skills added yet"
          description={isOwnProfile ? 'Add skills to show your technical strengths.' : 'This developer has not added skills yet.'}
          className="min-h-[180px] py-8"
        />
      )}

      {isOwnProfile && (
        <div className="mt-4">
          {isAdding ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1">
                <Label htmlFor="skill-input" className="text-xs uppercase tracking-[0.16em]">
                  Technology
                </Label>
                <Input
                  id="skill-input"
                  placeholder="e.g., React"
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1 sm:w-40">
                <Label htmlFor="level-select" className="text-xs uppercase tracking-[0.16em]">
                  Level
                </Label>
                <Select value={newLevel} onValueChange={setNewLevel}>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="rounded-xl"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim() || addSkill.isPending}
                >
                  {addSkill.isPending ? 'Adding...' : 'Add'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Skill
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
